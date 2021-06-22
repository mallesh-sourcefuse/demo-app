import {inject} from '@loopback/context';
import {compare, genSalt, hash} from 'bcrypt';
import {PasswordHasherBindings} from '../keys';


export class PasswordHasher {

  @inject(PasswordHasherBindings.HASHING_ROUNDS)
  private readonly rounds: number;

  async createHash(password: string) {
    const salt = await genSalt(this.rounds);
    const hashedPass = hash(password, salt);
    return hashedPass;
  }

  async comparePassword(providedPass: string, pass: string) {
    const passwordMatched = await compare(providedPass, pass);
    return passwordMatched;
  }

}
