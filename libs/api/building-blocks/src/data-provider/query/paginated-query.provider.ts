import { SelectQueryBuilder } from "typeorm";
import { AssemblerQueryService, Filter, QueryService, SelectRelation } from "@owl-app/crud-core";

import { PaginationConfig } from "../../config/pagination";
import { PaginatedQuery } from "../../pagination/paginated.query";
import { Pagination } from "../../pagination/pagination";

import type { DataProvider } from "../data.provider";
import { FilterBuilder } from "../filter.builder";
import { TypeOrmQueryService } from "@owl-app/crud-nestjs";
import { QueryFilterBuilder } from "./query-filter.builder";
import { instanceOf } from "@owl-app/utils";

type FilterBuilders<Entity, FiltersData> = FilterBuilder<Filter<Entity>, FiltersData>|QueryFilterBuilder<Entity, FiltersData>;

export class PaginatedDataProvider<Entity, FiltersData> implements DataProvider<Pagination<Entity>, FiltersData> {

  constructor(
    readonly queryService: QueryService<Entity>,
    readonly paginationConfig: PaginationConfig,
    readonly filterBuilder: FilterBuilders<Entity, FiltersData>
  ) {

  }

  async getData(
    filtersData: FiltersData,
    paginationQuery: PaginatedQuery,
  ): Promise<Pagination<Entity>> {
    let page = 0;
    let perPage = this.paginationConfig.perPage;
    const queryService = this.getTypeOrmQueryService();
    let filterQuery = {}
    let relations: SelectRelation<Entity>[] = [];

    if (paginationQuery.page && paginationQuery.page > 0) {
      page = (paginationQuery.page - 1) * paginationQuery.limit;
    }

    if(this.paginationConfig.availablePerPage.indexOf(paginationQuery.limit)) {
      perPage = paginationQuery.limit
    }

    if(instanceOf<FilterBuilder<Filter<Entity>, FiltersData>>(this.filterBuilder, 'build')) {
      filterQuery = this.filterBuilder.build(filtersData);
    }

    if (instanceOf<QueryFilterBuilder<Entity, FiltersData>>(this.filterBuilder, 'buildRelations')) {
      relations = this.filterBuilder.buildRelations();
    }

    const qb = queryService.filterQueryBuilder.select({
      filter: filterQuery,
      paging: {
        limit: perPage,
        offset: page,
      },
      relations,
    });

    if (instanceOf<QueryFilterBuilder<Entity, FiltersData>>(this.filterBuilder, 'buildCustom')) {
      this.filterBuilder.buildCustom(filtersData, qb);
    }

    const [items, total] = await this.getManyAndCount(qb);

    return { items, metadata: { total }};
  }

  private getTypeOrmQueryService(): TypeOrmQueryService<Entity> {
    let queryService = this.queryService;

    if(queryService instanceof AssemblerQueryService) {
      queryService = queryService.queryService;
    }

    if(!(queryService instanceof TypeOrmQueryService)) {
      throw new Error('Query service is not instance of TypeOrmQueryService');
    }

    return queryService;
  }

  private getManyAndCount(qb: SelectQueryBuilder<Entity>): Promise<[Entity[], number]> {
    if(this.queryService instanceof AssemblerQueryService) {
      return this.queryService.assembler.convertAsyncToDTOsWithCount(qb.getManyAndCount());
    } else {
      return qb.getManyAndCount();
    }
  }
}