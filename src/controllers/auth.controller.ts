import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, put, response, } from '@loopback/rest';
import {inject} from '@loopback/context';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';
import {PasswordHasher} from '../services/password.hasher';
import {MyUserService} from '../services/user.service';
import {validate} from '../services/validator';
import {UserProfile} from '@loopback/security';
import {PasswordHasherBindings, TokenServiceBindings, UserBindings} from '../keys';
import {getJsonSchemaRef, post, requestBody} from '@loopback/openapi-v3';
import {authenticate, AuthenticationBindings} from "@loopback/authentication";

import {Creds} from '.';


export class AuthController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) private hasher: PasswordHasher,
    @inject(UserBindings.USER_SERVICE) private userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) private jwtService: JWTService

  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User)
        }
      }
    }
  })
  async signup(@requestBody() userData: User) {
    validate(userData);
    userData.password = await this.hasher.createHash(userData.password);
    let user = await this.userRepository.create(userData);
    let returnUser = {...user}
    returnUser.password = '';
    return returnUser;
  }

  @post('/login')
  async login(@requestBody() creds: Creds) {
    validate(creds);
    console.log(this.userService, "user service");

    const user = await this.userService.verifyCredentials(creds);
    const token = await this.jwtService.generateToken(user);
    return {token}
  }

  @get('/me')
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile) {
    return currentUser
  }
}
