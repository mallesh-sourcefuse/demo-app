import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod, InvokeMiddleware, ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler
} from '@loopback/rest';


const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
  ) { }

  logTime(data: string) {
    const currentDate = '[' + new Date().toUTCString() + '] ';
    console.log(currentDate, data);
  }

  async handle(context: RequestContext) {
    try {
      this.logTime('Start Time :');

      const {request, response} = context;

      console.log('referer : ', request.headers['referer']);
      console.log('user agent : ', request.headers['user-agent']);
      console.log('request ip : ', request.ip);

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
      const result = await this.invoke(route, args);

      this.logTime('Completion Time : ');

      this.send(response, result);
    } catch (err) {
      this.logTime('Error Time : ');
      console.error(err);

      this.reject(context, err);
    }
  }
}
