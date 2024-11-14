import { Time } from '@owl-app/lib-contracts';
import { QueryFilterBuilder } from '@owl-app/lib-api-core/data-provider/query/query-filter.builder';
import { Filter, SelectRelation } from '@owl-app/nestjs-query-core';

import { FilterTimeRequest } from './dto';

export class ListFilterBuilder extends QueryFilterBuilder<
  Time,
  FilterTimeRequest
> {
  build(data: FilterTimeRequest): Filter<Time> {
    const filters: Filter<Time>[] = [];

    filters.push(
      this.filterRegistry.get('string').apply(['description'], data?.search)
    );

    if(data?.clients) {
      filters.push({ project: { client : { id: { in: data?.clients?.split(',') } } } });
    }

    if(data?.projects) {
      filters.push({ project: { id: { in: data?.projects?.split(',') } } });
    }

    filters.push({ timeIntervalEnd: { isNot: null } });

    return {
      and: filters,
    };
  }

  buildRelations(): SelectRelation<Time>[] {
    const relations = [
      {
        name: 'project',
        query: {},
      },
    ];

    return relations;
  }
}
