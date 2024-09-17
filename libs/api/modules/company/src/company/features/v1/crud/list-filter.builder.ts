import { Client } from '@owl-app/lib-contracts';
import { Filter } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils';
import { FilterBuilder } from '@owl-app/lib-api-core/data-provider/filter.builder';

import { FilterCompanyDto } from './dto';

export class ListFilterBuilder implements FilterBuilder<Filter<Client>, FilterCompanyDto> {
  build(data: FilterCompanyDto): Filter<Client>
  {
    const filters = [];

    if (!isEmpty(data.email)) {
      filters.push({
        name: { like: `%${data.email}%` },
      });
    }

    return {
      or: filters,
    }
  }
}