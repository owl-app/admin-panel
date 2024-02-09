import {
  Class,
QueryService
} from '@owl-app/crud-core';
import { TypeOrmQueryService } from '../services';
import { BaseCrudService, IBaseCRUDService } from './base-query.service';

export class CustomTypeOrmQueryService<Entity> 
  extends TypeOrmQueryService<Entity> 
  implements QueryService<Entity>
  {}

export const TypeOrmCrudService = <Entity>(
  entityClass: Class<Entity>
): Class<TypeOrmQueryService<Entity>> & Class<IBaseCRUDService<Entity>> => BaseCrudService(entityClass)(CustomTypeOrmQueryService) as unknown as Class<
    TypeOrmQueryService<Entity>
  > &
    Class<IBaseCRUDService<Entity>>;