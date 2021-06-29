import {Entity, belongsTo, model, property} from '@loopback/repository';

import {Role} from '.';
@model(
  {
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
  }
)
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;



  @belongsTo(() => Role, {keyTo: 'role_id', name: 'user_role'})
  role: number;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
