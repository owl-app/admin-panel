import { SelectQueryBuilder } from 'typeorm';
import { Client } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-core/data-provider/query/query-filter.builder';
import { Filter } from '@owl-app/crud-core';

import { FilterUserDto } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Client, FilterUserDto> {
  build(data: FilterUserDto): Filter<Client>
  {
    const filters: Filter<Client>[] = []

    filters.push(this.filterRegistry.get('string').apply(['email'], data?.search));

    return {
      or: filters
    }
  }

  buildCustom(filters: FilterUserDto, qb: SelectQueryBuilder<Client>): void {

  }
}