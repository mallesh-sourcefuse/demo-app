import {Model, model, property} from '@loopback/repository';

@model()
export class Cred extends Model {
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


  constructor(data?: Partial<Cred>) {
    super(data);
  }
}

export interface CredRelations {
  // describe navigational properties here
}

export type CredWithRelations = Cred & CredRelations;
