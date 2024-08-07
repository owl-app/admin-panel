import { FactoryProvider } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { Assembler, Class, Filter, getAssemblerQueryServiceToken, QueryService } from "@owl-app/crud-core";
import { getQueryServiceToken } from "@owl-app/crud-nestjs";

import { FilterBuilder } from "../filter.builder";
import { PAGINATION_CONFIG_PROVIDER, PaginationConfig } from '../../config/pagination'
import { PaginatedDataProvider } from "./paginated-query.provider"
import { getPaginatedQueryServiceToken } from "./decorators/helpers";

export function createPaginatedQueryServiceProvider<Entity>(
  entity: EntityClassOrSchema,
  filterBuilder: Class<FilterBuilder<Filter<Entity>, any>>,
  assembler?: Class<Assembler<any, any, any, any, any, any>>
): FactoryProvider {
  return {
    provide: getPaginatedQueryServiceToken(entity),
    useFactory(queryService: QueryService<Entity>, paginationConfig: PaginationConfig, ) {
      return new PaginatedDataProvider(
        queryService,
        paginationConfig,
        new filterBuilder(),
      );
    },
    inject: [
      !assembler ? getQueryServiceToken(entity) : getAssemblerQueryServiceToken(assembler),
      PAGINATION_CONFIG_PROVIDER
    ]
  }
}