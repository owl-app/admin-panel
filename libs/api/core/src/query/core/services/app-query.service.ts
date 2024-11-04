import { DeepPartial, QueryService, UpdateOneOptions, ModifyRelationOptions } from '@owl-app/nestjs-query-core';

/**
 * Base interface for all QueryServices.
 *
 * @typeparam T - The record type that the query service will operate on.
 */
export interface AppQueryService<DTO, C = DeepPartial<DTO>, U = DeepPartial<DTO>> extends QueryService<DTO, C, U> {

    createWithRelations(
      item: C,
      relations: Record<string, (string | number)[]>
    ): Promise<DTO>;
  
    updateWithRelations(
      id: number | string,
      update: U,
      relations: Record<string, (string | number)[]>,
      opts?: UpdateOneOptions<DTO>
    ): Promise<DTO>;

    assignRelations<Relation>(
      entity: DTO,
      id: string | number,
      relationIds: (string | number)[],
      opts?: ModifyRelationOptions<DTO, Relation>
    ): Promise<DTO>;
}
