import { Time } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/query/query-filter.builder';
import { Filter } from '@owl-app/crud-core';

import { FilterClientDto } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Time, FilterClientDto> {
  build(data: FilterClientDto): Filter<Time>
  {
    const filters: Filter<Time>[] = []

    filters.push(this.filterRegistry.get('string').apply(['description'], data?.search));

    return {
      or: filters
    }
  }
}