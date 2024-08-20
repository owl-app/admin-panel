import { Client, Role } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-bulding-blocks/data-provider/query/query-filter.builder';
import { Filter, SelectRelation } from '@owl-app/crud-core';

import { FilterRoleDto } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Role, FilterRoleDto> {
  build(data: FilterRoleDto): Filter<Client>
  {
    const filters: Filter<Client>[] = []

    filters.push(this.filterRegistry.get('string').apply(['name'], data?.search));

    return {
      or: filters
    }
  }

  buildRelations(): SelectRelation<Role>[] {
    return [{ name: 'setting', query: {}}];
  }
}