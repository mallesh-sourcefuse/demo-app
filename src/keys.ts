import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {Creds} from './controllers';
import {User} from './models';
import {ILogger} from './providers/logger.provider';
import {JWTService} from './services/jwt.service';
import {PasswordHasher} from './services/password.hasher';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'SOME_SECRET_VALUE';
  export const TOKEN_EXPIRE_IN_VALUE = '1h'
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>('jwt.secret');
  export const TOKEN_EXPIRE_IN = BindingKey.create<string>('jwt.expireIn');
  export const TOKEN_SERVICE = BindingKey.create<JWTService>('service.jwt.service');
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('service.hasher');
  export const HASHING_ROUNDS = BindingKey.create<number>('rounds');
}

export namespace UserBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Creds>>('service.user.service');
}

export namespace LoggerBindings {
  export const LOGGER = BindingKey.create<ILogger>('providers.logger');
}
