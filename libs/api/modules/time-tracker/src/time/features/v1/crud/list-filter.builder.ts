import { SelectQueryBuilder } from 'typeorm';

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

    return {
      or: filters,
      and: [{ timeIntervalEnd: { isNot: null } }],
    };
  }

  buildCustom?(filters: FilterTimeRequest, qb: SelectQueryBuilder<Time>): void {
    // qb.leftJoinAndSelect(`${qb.alias}.tags`, 'tags');
    // qb.groupBy(`${qb.alias}.id`);
    // qb.orderBy(`${qb.alias}.timeIntervalStart`, 'DESC');
    // qb.addOrderBy('tags.name', 'DESC');
  }

  // buildRelations(): SelectRelation<Time>[] {
  //   return [{ name: 'tags', query: {}}];
  // }
}
