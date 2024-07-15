import { SelectQueryBuilder } from 'typeorm'
import {
  Query,
} from '@owl-app/crud-core'
import { FilterQueryBuilder } from '@owl-app/crud-nestjs'
import { Registry } from '@owl-app/registry';

import { TenantFilter } from '../filters/tenant.filter';

export class TenantFilterQueryBuilder<Entity> extends FilterQueryBuilder<Entity>
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(readonly repo: any, readonly filters?: Registry<TenantFilter<Entity>>,) {
    super(repo)
  }

  public override select(query: Query<Entity>): SelectQueryBuilder<Entity> {
    const qb = super.select(query)

    const filters = this.filters?.all();

    if (filters) {
      Object.entries(filters).forEach((filter) => {
        if (filter[1].supports(this.repo.metadata)) {
          filter[1].execute(qb);
        } 
        
      })
    }

    return qb;
  }
}
