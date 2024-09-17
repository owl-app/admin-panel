import { SelectQueryBuilder } from 'typeorm';
import { Query } from '@owl-app/crud-core';
import { FilterQueryBuilder as BaseFilterQueryBuilder } from '@owl-app/crud-nestjs';
import { Registry } from '@owl-app/registry';

import { FilterQuery } from '../../../registry/interfaces/filter-query';

export class FilterQueryBuilder<Entity> extends BaseFilterQueryBuilder<Entity> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    readonly repo: any,
    readonly filters?: Registry<FilterQuery<Entity>>
  ) {
    super(repo);
  }

  public override select(query: Query<Entity>): SelectQueryBuilder<Entity> {
    const qb = super.select(query);

    const filters = this.filters?.all();

    if (filters) {
      Object.entries(filters).forEach((filter) => {
        if (filter[1].supports(this.repo.metadata)) {
          filter[1].execute(qb);
        }
      });
    }

    return qb;
  }
}
