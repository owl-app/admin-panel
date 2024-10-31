import { FactoryProvider } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { Registry } from '@owl-app/registry';
import {
  Assembler,
  Class,
  Filter as FilterQueryService,
  getAssemblerQueryServiceToken,
  QueryService,
} from '@owl-app/crud-core';
import { getQueryServiceToken } from '@owl-app/crud-nestjs';

import { FilterBuilder } from '../filter.builder';
import {
  PAGINATION_CONFIG_PROVIDER,
  PaginationConfig,
} from '../../config/pagination';
import { Filter } from '../filtering/filter';
import { DATA_PROVIDER_FILTER_REGISTRY, DATA_PROVIDER_FILTER_CUSTOM_REGISTRY } from '../contants';

import { PaginatedDataProvider } from './paginated-query.provider';
import { getPaginatedQueryServiceToken } from './decorators/helpers';
import { FilterCustom } from '../filtering/filter-custom';
import { SelectQueryBuilder } from 'typeorm';

export function createPaginatedQueryServiceProvider<Entity>(
  entity: EntityClassOrSchema,
  filterBuilder: Class<FilterBuilder<FilterQueryService<Entity>, any>>,
  assembler?: Class<Assembler<any, any, any, any, any, any>>
): FactoryProvider {
  return {
    provide: getPaginatedQueryServiceToken(entity),
    useFactory(
      queryService: QueryService<Entity>,
      paginationConfig: PaginationConfig,
      filterServiceRegistry: Registry<Filter<FilterQueryService<Entity>>>,
      filterCustomServiceRegistry: Registry<FilterCustom<SelectQueryBuilder<Entity>>>
    ) {
      return new PaginatedDataProvider(
        queryService,
        paginationConfig,
        new filterBuilder(filterServiceRegistry, filterCustomServiceRegistry)
      );
    },
    inject: [
      !assembler
        ? getQueryServiceToken(entity)
        : getAssemblerQueryServiceToken(assembler),
      PAGINATION_CONFIG_PROVIDER,
      DATA_PROVIDER_FILTER_REGISTRY,
      DATA_PROVIDER_FILTER_CUSTOM_REGISTRY,
    ],
  };
}
