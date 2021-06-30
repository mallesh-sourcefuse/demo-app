import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {Getter} from '@loopback/core';
import {FindRoute, HttpErrors, InvokeMethod, InvokeMiddleware, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
  UserPermissionsFn
} from 'loopback4-authorization';
import {LoggerBindings} from './keys';
import {User} from './models';
import {ILogger} from './providers/logger.provider';

export class MySequence implements SequenceHandler {
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(@inject(LoggerBindings.LOGGER) private logger: ILogger,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD)
    protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,

    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly getCurrentUser: Getter<User>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    private readonly getUserPermissions: UserPermissionsFn<string>,
  ) {
  }
  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;
      this.logger.logInfo(`Request ${request.method} ${request.url
        } started at ${Date.now().toString()}.
      Request Details
      Referer = ${request.headers.referer}
      User-Agent = ${request.headers['user-agent']}`)
      const allowedOrigin: string[] = (process.env.ALLOWED_ORIGIN ?? '')
        .split(',')
        .map(origin => origin.trim());
      const requestOrigin: string = request.headers['host'] ?? '';
      if (!allowedOrigin.includes(requestOrigin)) {
        throw new Error('Requests Not allowed from this Origin');
      }
      const finished = await this.invokeMiddleware(context);
      if (finished) {
        return;
      }

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const authenticatedUser = await this.authenticateRequest(request);
      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authenticatedUser && authenticatedUser.permissions,
        request,
      );
      console.log(isAccessAllowed)
      if (authenticatedUser != undefined && !isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      const result = await this.invoke(route, args);
      this.send(response, result);
      this.logger.logInfo(`Request end time:- ${new Date().toISOString()}`)
    } catch (e) {
      this.logger.logError(JSON.stringify(e));
      this.reject(context, e);
    }
  }


}
