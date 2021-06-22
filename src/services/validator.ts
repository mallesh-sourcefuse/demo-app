import {HttpErrors} from '@loopback/rest';
import * as isEmail from 'isemail';
import {Creds} from '../controllers';
import {User} from '../models';


export function validate(user: User | Creds) {
  if (!isEmail.validate(user.email)) {
    throw new HttpErrors.UnprocessableEntity("Email is not correct");
  }

  if (user.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity("Password should be 8 char length");
  }
}
