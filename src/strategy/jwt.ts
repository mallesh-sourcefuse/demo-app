import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';
import {JWTService} from '../services/jwt.service';

export class JWTStrategy implements AuthenticationStrategy {
  name = "jwt";

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: JWTService
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCreds(request);
    const userProfile = await this.tokenService.verifyToken(token);
    return userProfile
  }

  extractCreds(request: Request): string {
    const authHeaderValue = request.headers.authorization;
    if (!authHeaderValue)
      throw new HttpErrors[401]("Autherization header is missing");
    const parts = authHeaderValue?.split(' ');
    const token = parts[1];
    return token;
  }
}
