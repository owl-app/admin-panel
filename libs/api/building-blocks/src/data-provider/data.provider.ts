import { PaginatedQuery } from "../pagination/paginated.query";

export interface DataProvider<Data, FiltersData> {
  getData(
    filters: FiltersData,
    paginationQuery: PaginatedQuery,
  ): Promise<Data>;
}