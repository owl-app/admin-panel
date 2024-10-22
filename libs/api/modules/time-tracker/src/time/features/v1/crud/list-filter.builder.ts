import { Tag, Time } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-core/data-provider/query/query-filter.builder';
import { Filter, SelectRelation } from '@owl-app/crud-core';

import { FilterTimeRequest } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<Time, FilterTimeRequest> {
  build(data: FilterTimeRequest): Filter<Time>
  {
    const filters: Filter<Time>[] = []

    filters.push(this.filterRegistry.get('string').apply(['description'], data?.search));

    return {
      or: filters,
      and: [
        { timeIntervalEnd: { isNot: null }}
      ]
    }
  }

  buildRelations(): SelectRelation<Time>[] {
    return [{ name: 'tags', query: {}}];
  }
}