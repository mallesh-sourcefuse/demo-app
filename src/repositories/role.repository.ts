import {DefaultCrudRepository} from '@loopback/repository';
import {Role, RoleRelations} from '../models';
import {PostgresDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.role_id,
  RoleRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDsDataSource,
  ) {
    super(Role, dataSource);
  }
}
