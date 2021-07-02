import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DataObject, Options, repository} from '@loopback/repository';
import {AuthenticationBindings, AuthErrorKeys, IAuthUser} from 'loopback4-authentication';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {RoleRepository} from './role.repository';
import {PostgresDsDataSource} from '../datasources';
import {Role, User, UserRelations} from '../models';
import * as bcrypt from 'bcrypt';

export class UserRepository extends SoftCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly user_role: BelongsToAccessor<
    Role,
    typeof Role.prototype.role_id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDsDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER, {optional: true})
    protected readonly getCurrentUser: Getter<IAuthUser | undefined>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(User, dataSource, getCurrentUser);

    this.user_role = this.createBelongsToAccessorFor(
      'user_role',
      roleRepositoryGetter,
    );

    this.registerInclusionResolver('user_role', this.user_role.inclusionResolver);
  }
  private readonly saltRounds = 8;

  async create(entity: DataObject<User>, options?: Options): Promise<User> {

    entity.password = await bcrypt.hash(
      entity.password ?? '',
      this.saltRounds,
    );
    const user = await super.create(entity, options);
    return user;
  }
}
