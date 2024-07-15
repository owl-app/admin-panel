/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Repository } from 'typeorm'

import { Registry } from '@owl-app/registry'
import { RelationQueryBuilder } from '@owl-app/crud-nestjs'

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
}
