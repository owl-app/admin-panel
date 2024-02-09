import {
  Class,
  Filter,
  QueryService,
  DeepPartial,
  AssemblerQueryService
} from '@owl-app/crud-core';
import { PaginatedRequest, Pagination} from '../pagination';
import { BaseCrudService } from './base-crud.service';

type DefaultDeepPartial<Cls, T> = unknown extends Cls ? DeepPartial<T> : Cls;

export interface IAssemblerCRUDService<Entity, DTO>
  extends QueryService<Entity> {
  paginated(
    filter: Filter<Entity>,
    paginationQuery: PaginatedRequest
  ): Promise<Pagination<DTO>>;
}

export const AssemblerCrudService = <
  Entity,
  DTO,
  CreateDTO = undefined,
  CreateEntity = undefined,
  C = DefaultDeepPartial<CreateDTO, DTO>,
  CE = DefaultDeepPartial<CreateEntity, Entity>,
  U = C,
  UE = CE
>(
  entityClass: Class<Entity>,
  DTOClass: Class<DTO>
): Class<AssemblerQueryService<DTO, Entity, C, CE, U, UE>> &
  Class<IAssemblerCRUDService<Entity, DTO>> => {
  class CustomAssemblerServiceQuery extends AssemblerQueryService<
    DTO,
    Entity
  > {}

  return BaseCrudService(
    entityClass,
    DTOClass
  )(CustomAssemblerServiceQuery) as unknown as Class<
    AssemblerQueryService<DTO, Entity, C, CE, U, UE>
  > &
    Class<IAssemblerCRUDService<Entity, DTO>>;
};
