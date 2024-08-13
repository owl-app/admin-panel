import { Filter, QueryService } from "@owl-app/crud-core";

import { PaginationConfig } from "../../config/pagination";
import { PaginatedQuery } from "../../pagination/paginated.query";
import { Pagination } from "../../pagination/pagination";

import type { DataProvider } from "../data.provider";
import { FilterBuilder } from "../filter.builder";

export class PaginatedDataProvider<Entity, FiltersData> implements DataProvider<Pagination<Entity>, FiltersData> {

  constructor(
    readonly queryService: QueryService<Entity>,
    readonly paginationConfig: PaginationConfig,
    readonly filterBuilder: FilterBuilder<Filter<Entity>, FiltersData>
  ) {

  }

  async getData(
    filters: FiltersData,
    paginationQuery: PaginatedQuery,
  ): Promise<Pagination<Entity>> {
    let page = 0;
    let perPage = this.paginationConfig.perPage;

    if (paginationQuery.page && paginationQuery.page > 0) {
      page = (paginationQuery.page - 1) * paginationQuery.limit;
    }

    if(this.paginationConfig.availablePerPage.indexOf(paginationQuery.limit)) {
      perPage = paginationQuery.limit
    }

    const [items, total] = await this.queryService.queryWithCount({
      filter: this.filterBuilder.build(filters),
      paging: {
        limit: perPage,
        offset: page,
      },
    });

    return { items, metadata: { total } };
  }
}