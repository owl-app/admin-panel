import { Repository } from 'typeorm';
import { cloneDeep, omit } from 'lodash';

import {
  TypeOrmQueryService,
  TypeOrmQueryServiceOpts,
} from '@owl-app/crud-nestjs';
import { DeepPartial, UpdateOneOptions } from '@owl-app/crud-core';
import { convertToSnakeCase } from '@owl-app/utils';
import { Registry } from '@owl-app/registry';

import { DomainEvent } from '../../event/domain-event.base';
import { FilterQueryBuilder } from './query/filter-query.builder';
import { FilterQuery } from '../../registry/interfaces/filter-query';
import { RelationQueryBuilder } from './query/relation-query.builder';
import { EntitySetter } from '../../registry/interfaces/entity-setter';
import { TransactionalRepository } from '../../database/repository/transactional.repository';
import DomainEventableEntity from '../../database/entity/domain-eventable.entity';

export interface CrudTypeOrmQueryServiceOpts<Entity>
  extends TypeOrmQueryServiceOpts<Entity> {
  useTransaction?: boolean;
}

export class CrudTypeOrmQueryService<
  Entity extends DomainEventableEntity
> extends TypeOrmQueryService<Entity> {
  readonly filterQueryBuilder: FilterQueryBuilder<Entity>;

  readonly useTransaction: boolean;

  readonly events = {
    EVENT_CREATED: 'CREATED',
    EVENT_UPDATED: 'UPDATED',
    EVENT_DELETED: 'DELETED',
  };

  constructor(
    readonly repo: Repository<Entity>,
    opts?: CrudTypeOrmQueryServiceOpts<Entity>,
    readonly filters?: Registry<FilterQuery<Entity>>,
    readonly setters?: Registry<EntitySetter<DeepPartial<Entity>>>
  ) {
    opts.filterQueryBuilder = new FilterQueryBuilder<Entity>(repo, filters);
    super(repo, opts);
    this.useTransaction = opts?.useTransaction ?? true;
  }

  public getRelationQueryBuilder<Relation>(
    name: string
  ): RelationQueryBuilder<Entity, Relation> {
    return new RelationQueryBuilder(
      this.repo,
      name,
      this.filters as unknown as Registry<FilterQuery<Relation>>
    );
  }

  public override async createOne(
    record: DeepPartial<Entity>
  ): Promise<Entity> {
    this.injectSetters(record);

    const entity = (await this.ensureIsEntityAndDoesNotExist(record)) as Entity;

    if (record instanceof DomainEventableEntity) {
      this.createEvent(this.events.EVENT_CREATED, entity);
    }

    if (this.useTransaction) {
      if (this.repo instanceof TransactionalRepository) {
        return await this.repo.transaction(async () => this.repo.save(entity));
      }

      throw new Error('Repository should extend by TransactionalRepository');
    }

    return this.repo.save(entity);
  }

  public override async createWithRelations(
    record: DeepPartial<Entity>,
    relations: Record<string, (string | number)[]>,
  ): Promise<Entity> {
    this.injectSetters(record);

    const entity = await this.ensureIsEntityAndDoesNotExist(record)

    if (record instanceof DomainEventableEntity) {
      this.createEvent(this.events.EVENT_CREATED, entity);
    }

    const entityWithRelations = await Promise.all(
        Object.entries(relations).map(async ([name, ids]) => this.assignRelations(entity, name, ids))
      ).then(() => entity);

    if (this.useTransaction) {
      if (this.repo instanceof TransactionalRepository) {
        return await this.repo.transaction(async () => this.repo.save(entityWithRelations));
      }

      throw new Error('Repository should extend by TransactionalRepository');
    }

    return this.repo.save(entity)
  }

  public override async updateWithRelations(
    id: number | string,
    update: DeepPartial<Entity>,
    relations: Record<string, (string | number)[]>,
    opts?: UpdateOneOptions<Entity>,
  ): Promise<Entity> {
    this.ensureIdIsNotPresent(update);

    const entity = await this.getById(id, opts);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.repo.merge(entity, update);

    if (update instanceof DomainEventableEntity) {
      this.createEvent(this.events.EVENT_UPDATED, entity);
    }

    const entityWithRelations = await Promise.all(
        Object.entries(relations).map(async ([name, ids]) => this.assignRelations(entity, name, ids))
      ).then(() => entity);

    return this.repo.save(entityWithRelations)
  }

  private injectSetters(record: DeepPartial<Entity>): void {
    const setters = this.setters?.all();

    if (setters) {
      Object.entries(setters).forEach((setter) => {
        if (setter[1].supports(this.repo.metadata)) {
          setter[1].execute(record);
        }
      });
    }
  }

  private createEvent(name: string, entity: Entity): DomainEvent {
    const eventName = `${convertToSnakeCase(this.EntityClassName)}_${name}`;
    const event = new DomainEvent({ eventName });

    Object.assign(event, cloneDeep(omit(entity, ['_domainEvents'])));
    entity.addEvent(event);

    return event;
  }
}
