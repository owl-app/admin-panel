import { Repository } from 'typeorm'

import { RelationQueryBuilder, TypeOrmQueryService, TypeOrmQueryServiceOpts } from '@owl-app/crud-nestjs'
import { DeepPartial } from '@owl-app/crud-core'
import { convertToSnakeCase } from '@owl-app/utils'
import { Registry } from '@owl-app/registry'

import { BaseRepository } from '../../database/repository/base.repository'
import { DomainEvent } from '../../event/domain-event.base'
import { TenantFilterQueryBuilder } from '../query/tenant-filter-query.builder'
import { TenantFilter } from '../filters/tenant.filter'
import { TenantSetter } from '../setters/tenant.setter'
import { TenantRelationQueryBuilder } from '../query/tenant-relation-query.builder'
import BaseEntity from '../../database/entity/base.entity'

export class TenantTypeOrmQueryService<Entity extends BaseEntity> extends TypeOrmQueryService<Entity>
{
  readonly filterQueryBuilder: TenantFilterQueryBuilder<Entity>

  readonly useSoftDelete: boolean

  readonly events = {
    EVENT_CREATED: 'CREATED',
    EVENT_UPDATED: 'UPDATED',
    EVENT_DELETED: 'DELETED',
  }

  constructor(
    readonly repo: Repository<Entity>,
    opts?: TypeOrmQueryServiceOpts<Entity>,
    readonly filters?: Registry<TenantFilter<Entity>>,
    readonly setters?: Registry<TenantSetter<DeepPartial<Entity>>>,
  ) {
    opts.filterQueryBuilder = new TenantFilterQueryBuilder<Entity>(repo, filters)
    super(repo, opts)
  }

  public getRelationQueryBuilder<Relation>(name: string): RelationQueryBuilder<Entity, Relation> {
    return new TenantRelationQueryBuilder(this.repo, name, this.filters as unknown as Registry<TenantFilter<Relation>>)
  }

  public override async createOne(record: DeepPartial<Entity>): Promise<Entity> {
    const setters = this.setters?.all();

    if (setters) {
      Object.entries(setters).forEach((setter) => {
        if (setter[1].supports(this.repo.metadata)) {
          setter[1].execute(record);
        }
      })
    }

    if (this.repo instanceof BaseRepository) {
      return await this.createOneTransactional(record)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return super.createOne(record)
  }

  public async createOneTransactional(record: DeepPartial<Entity>): Promise<Entity> {
    const repo = this.repo as BaseRepository<Entity>
    const entity = await this.ensureIsEntityAndDoesNotExist(record) as Entity

    if(record instanceof BaseEntity) {
      this.copyOriginalEvents(entity, record)
      this.createEvent(this.events.EVENT_CREATED, entity)
    }

    return await repo.transaction(async () => this.repo.save(entity))
  }

  private createEvent(name: string, entity: Entity): DomainEvent {
    const eventName = `${convertToSnakeCase(this.EntityClassName)}_${name}`;
    const event = new DomainEvent({eventName})

    Object.assign(event, entity)

    entity.addEvent(event)

    return event
  }

  private copyOriginalEvents(entity: Entity, record: BaseEntity): void {
      record?.domainEvents.map((event) => {
        entity.addEvent(event);
      })
  }
}
