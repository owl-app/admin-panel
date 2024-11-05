import { DeepPartial, QueryService, UpdateOneOptions, Filter, WithDeleted } from '@owl-app/nestjs-query-core';

/**
 * Base interface for all QueryServices.
 *
 * @typeparam T - The record type that the query service will operate on.
 */
export interface AppQueryService<DTO, C = DeepPartial<DTO>, U = DeepPartial<DTO>> extends QueryService<DTO, C, U> {

    createWithRelations(
      item: C,
      filters?: Filter<DTO>,
      opts?: WithDeleted,
    ): Promise<DTO>;
  
    updateWithRelations(
      id: number | string | Filter<DTO>,
      update: U,
      opts?: UpdateOneOptions<DTO>,
    ): Promise<DTO>;

}
