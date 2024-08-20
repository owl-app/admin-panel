import { Client } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/query/query-filter.builder';
import { Filter } from '@owl-app/crud-core';

import { FilterClientDto } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Client, FilterClientDto> {
  build(data: FilterClientDto): Filter<Client>
  {
    const filters: Filter<Client>[] = []

    filters.push(this.filterRegistry.get('string').apply(['name'], data?.search));

    return {
      or: filters
    }
  }
}