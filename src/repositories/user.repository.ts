import {inject} from '@loopback/core';
import {DefaultTransactionSoftCrudRepository} from 'loopback4-soft-delete';
import {DbDataSource} from '../datasources';
import {BelongsToAccessor, DataObject, Options, repository} from '@loopback/repository';
import {Role, User, UserRelations} from '../models';

export class UserRepository extends DefaultTransactionSoftCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {


  public readonly user_role: BelongsToAccessor<
    Role,
    typeof Role.prototype.role_id
  >
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(User, dataSource);
  }
}
