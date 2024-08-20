import { Client } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/query/query-filter.builder';
import { Filter } from '@owl-app/crud-core';

import { FilterRoleDto } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Client, FilterRoleDto> {
  build(data: FilterRoleDto): Filter<Client>
  {
    const filters: Filter<Client>[] = []

    filters.push(this.filterRegistry.get('string').apply(['name'], data?.search));

    console.log(filters)

    return {
      or: filters
    }
  }
}