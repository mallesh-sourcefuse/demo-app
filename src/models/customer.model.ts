import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    foreignKeys: {
      fk_customer_user: {
        name: 'fk_customer_user',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'user_id',
      }
    },
  }
})
export class Customer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  customer_id?: number;

  @belongsTo(() => User, {name: 'user', keyTo: 'id'})
  user_id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
  })
  address?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
