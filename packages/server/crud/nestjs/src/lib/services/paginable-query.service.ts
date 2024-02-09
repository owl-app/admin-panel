import { Filter } from '@owl-app/crud-core';

import { Pagination, PaginatedRequest } from '../pagination';

export interface PaginableQueryService<Entity, DTO> {
  /**
   * Query for multiple records of type `T`.
   * @param query - the query used to filer, page or sort records.
   * @param selectRelations - additional relation to select and fetch in the same query.
   * @returns a promise with an array of records that match the query.
   */
  paginated(
    filter: Filter<Entity>,
    paginationQuery: PaginatedRequest
  ): Promise<Pagination<Entity | DTO>>;
}
