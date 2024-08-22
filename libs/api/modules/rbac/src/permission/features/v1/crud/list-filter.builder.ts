import { Client, Permission } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/query/query-filter.builder';
import { Filter } from '@owl-app/crud-core';

import { FilterPermissionDto } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Permission, FilterPermissionDto> {
  build(data: FilterPermissionDto): Filter<Client>
  {
    const filters: Filter<Client>[] = []

    filters.push(this.filterRegistry.get('string').apply(['name'], data?.search));

    return {
      or: filters
    }
  }
}