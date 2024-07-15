import { Repository } from 'typeorm'

import { RelationQueryBuilder, TypeOrmQueryService, TypeOrmQueryServiceOpts } from '@owl-app/crud-nestjs'

import { TenantFilterQueryBuilder } from '../query/tenant-filter-query.builder'
import { Registry } from '@owl-app/registry'
import { TenantFilter } from '../filters/tenant.filter'
import { TenantSetter } from '../setters/tenant.setter'
import { TenantRelationQueryBuilder } from '../query/tenant-relation-query.builder'

export class TenantTypeOrmQueryService<Entity> extends TypeOrmQueryService<Entity>
{
  readonly filterQueryBuilder: TenantFilterQueryBuilder<Entity>

  readonly useSoftDelete: boolean

  constructor(
    readonly repo: Repository<Entity>,
    opts?: TypeOrmQueryServiceOpts<Entity>,
    readonly filters?: Registry<TenantFilter<Entity>>,
    readonly setters?: Registry<TenantSetter<Entity>>,
  ) {
    opts.filterQueryBuilder = new TenantFilterQueryBuilder<Entity>(repo, filters)
    super(repo, opts)
  }

  public getRelationQueryBuilder<Relation>(name: string): RelationQueryBuilder<Entity, Relation> {
    return new TenantRelationQueryBuilder(this.repo, name, this.filters as unknown as Registry<TenantFilter<Relation>>)
  }
}
