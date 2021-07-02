import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Creds} from '../controllers';
import {PasswordHasherBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {PasswordHasher} from './password.hasher';


export class MyUserService implements UserService<User, Creds>{


  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    private hasherService: PasswordHasher
  ) {
  }

  async verifyCredentials(credentials: Creds): Promise<User> {
    const foundUser = await this.userRepo.findOne({
      where: {
        email: credentials.email
      }
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound("User not found");
    }
    console.log(credentials.password, foundUser.password)
    const matched = await this.hasherService.comparePassword(credentials.password, foundUser.password);
    if (!matched) {
      throw new HttpErrors.Unauthorized("Invalid password");
    }
    return foundUser
  }

  convertToUserProfile(user: User): UserProfile {
    throw new Error('Method not implemented.');
  }

}
