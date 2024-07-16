/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Repository, SelectQueryBuilder } from 'typeorm'

import { Query } from '@owl-app/crud-core'
import { RelationQueryBuilder } from '@owl-app/crud-nestjs'
import { Registry } from '@owl-app/registry'

import { TenantFilterQueryBuilder } from './tenant-filter-query.builder'
import { TenantFilter } from '../filters/tenant.filter'

export class TenantRelationQueryBuilder<Entity, Relation> extends RelationQueryBuilder<Entity, Relation> {
  constructor(
    readonly repo: Repository<Entity>,
    readonly relation: string,
    readonly filters?: Registry<TenantFilter<Relation>>,
  ) {
    super(repo, relation)
    const filterQueryBuilder = new TenantFilterQueryBuilder<Relation>(this.relationRepo, filters);
    this.filterQueryBuilder = filterQueryBuilder;
  }

  public select(entity: Entity, query: Query<Relation>): SelectQueryBuilder<Relation> {
    const qb = super.select(entity, query)

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
