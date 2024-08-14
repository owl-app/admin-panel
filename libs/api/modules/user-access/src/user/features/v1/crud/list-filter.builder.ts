import { SelectQueryBuilder } from 'typeorm';
import { Client } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/query/query-filter.builder';
import { Filter } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils';

import { FilterUserDto } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Client, FilterUserDto> {
  build(data: FilterUserDto): Filter<Client>
  {
    const filters: Filter<Client>[] = []

    filters.push(this.filterRegistry.get('string').apply(['email'], 'role'));

    if (!isEmpty(data.email)) {
      filters.push({
        email: { like: `%${data.email}%` },
      });
    }

    return {
      or: filters,
    }
  }

  buildCustom(filters: FilterUserDto, qb: SelectQueryBuilder<Client>): void {

  }
}