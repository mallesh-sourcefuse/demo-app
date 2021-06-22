import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';
import {User} from '../models';
const jwt = require('jsonwebtoken');


export class JWTService {

  @inject(TokenServiceBindings.TOKEN_SECRET)
  private readonly secret: string;

  @inject(TokenServiceBindings.TOKEN_EXPIRE_IN)
  private readonly expireIn: string;

  async generateToken(user: User | any): Promise<string> {
    const token = jwt.sign({id: user.id, name: user.name}, this.secret, {expiresIn: this.expireIn});
    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    let userProfile: UserProfile;
    try {
      const decoded = jwt.verify(token, this.secret);
      userProfile = Object.assign({name: '', id: ''}, {
        id: decoded.id, name: decoded.name, [securityId]: decoded.id
      });

    } catch (e) {
      throw new HttpErrors.Unauthorized("Unauthorised")
    }
    return userProfile;
  }
}
