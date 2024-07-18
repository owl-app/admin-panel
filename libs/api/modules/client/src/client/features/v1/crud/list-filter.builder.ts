import { Client } from '@owl-app/lib-contracts';
import { FilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/filter.builder';
import { Filter } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils';

import { FilterClientDto } from './dto';

export class ListFilterBuilder implements FilterBuilder<Filter<Client>, FilterClientDto> {
  build(data: FilterClientDto): Filter<Client>
  {
    const filters = [];

    if (!isEmpty(data.name)) {
      filters.push({
        name: { like: `%${data.name}%` },
      });
    }

    return {
      or: filters,
    }
  }
}