import {belongsTo, model, property} from '@loopback/repository';
import {SoftDeleteEntity} from 'loopback4-soft-delete';
import {Role} from '.';

@model({
  settings: {
    foreignKeys: {
      fk_user_role: {
        name: 'fk_user_role',
        entity: 'Role',
        entityKey: 'role_id',
        foreignKey: 'role',
      }
    },
  }
})
export class User extends SoftDeleteEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
  })
  middle_name?: string;

  @property({
    type: 'string',
  })
  last_name?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @belongsTo(() => Role, {keyTo: 'role_id', name: 'user_role'})
  role: number;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  modified_at?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
