import {inject} from '@loopback/core';
import {DefaultCrudRepository, } from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Customer, CustomerRelations, User} from '../models';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.customer_id,
  CustomerRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Customer, dataSource);
  }
}
