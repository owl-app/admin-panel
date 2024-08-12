import { Client } from '@owl-app/lib-contracts';
import { FilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/filter.builder';
import { Filter } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils';

import { FilterUserDto } from './dto';

export class ListFilterBuilder implements FilterBuilder<Filter<Client>, FilterUserDto> {
  build(data: FilterUserDto): Filter<Client>
  {
    const filters = [];

    if (!isEmpty(data.email)) {
      filters.push({
        email: { like: `%${data.email}%` },
      });
    }

    return {
      or: filters,
    }
  }
}