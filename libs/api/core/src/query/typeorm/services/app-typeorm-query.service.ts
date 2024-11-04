import { Repository } from 'typeorm';
import { cloneDeep, omit } from 'lodash';

import {
  TypeOrmQueryService,
  TypeOrmQueryServiceOpts,
} from '@owl-app/nestjs-query-typeorm';
import { DeepPartial, UpdateOneOptions, ModifyRelationOptions } from '@owl-app/nestjs-query-core';
import { convertToSnakeCase } from '@owl-app/utils';
import { Registry } from '@owl-app/registry';

import { DomainEvent } from '../../../event/domain-event.base';
import { FilterQueryBuilder } from '../query/filter-query.builder';
import { FilterQuery } from '../../../registry/interfaces/filter-query';
import { RelationQueryBuilder } from '../query/relation-query.builder';
import { EntitySetter } from '../../../registry/interfaces/entity-setter';
import { TransactionalRepository } from '../../../database/repository/transactional.repository';
import DomainEventableEntity from '../../../database/entity/domain-eventable.entity';
import { AppQueryService } from '../../core/services/app-query.service';

export interface AppTypeOrmQueryServiceOpts<Entity>
  extends TypeOrmQueryServiceOpts<Entity> {
  useTransaction?: boolean;
}

export class AppTypeOrmQueryService<
  Entity extends DomainEventableEntity
> extends TypeOrmQueryService<Entity> implements AppQueryService<Entity> {
  readonly filterQueryBuilder: FilterQueryBuilder<Entity>;

  readonly useTransaction: boolean;

  readonly events = {
    EVENT_CREATED: 'CREATED',
    EVENT_UPDATED: 'UPDATED',
    EVENT_DELETED: 'DELETED',
  };

  constructor(
    readonly repo: Repository<Entity>,
    opts?: AppTypeOrmQueryServiceOpts<Entity>,
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

  public async createOne(
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

  public async createWithRelations(
    record: DeepPartial<Entity>,
    relations: Record<string, (string | number)[]>
  ): Promise<Entity> {
    const newEntity = this.repo.create({} as Entity);

    this.copyRegularColumn(record, newEntity);
    this.injectSetters(newEntity as DeepPartial<Entity>);

    const entity = await this.ensureEntityDoesNotExist(newEntity);

    if (record instanceof DomainEventableEntity) {
      this.createEvent(this.events.EVENT_CREATED, entity);
    }

    const entityWithRelations = await Promise.all(
      Object.entries(relations).map(async ([name, ids]) =>
        this.assignRelations(entity, name, ids)
      )
    ).then(() => entity);

    if (this.useTransaction) {
      if (this.repo instanceof TransactionalRepository) {
        return await this.repo.transaction(async () =>
          this.repo.save(entityWithRelations)
        );
      }

      throw new Error('Repository should extend by TransactionalRepository');
    }

    return this.repo.save(entity);
  }

  public async updateWithRelations(
    id: number | string,
    update: DeepPartial<Entity>,
    relations: Record<string, (string | number)[]>,
    opts?: UpdateOneOptions<Entity>
  ): Promise<Entity> {
    this.ensureIdIsNotPresent(update);

    const entity = await this.getById(id, opts);

    this.copyRegularColumn(update, entity);

    if (update instanceof DomainEventableEntity) {
      this.createEvent(this.events.EVENT_UPDATED, entity);
    }

    const entityWithRelations = await Promise.all(
      Object.entries(relations).map(async ([name, ids]) =>
        this.assignRelations(entity, name, ids)
      )
    ).then(() => entity);

    return this.repo.save(entityWithRelations);
  }

  public async assignRelations<Relation>(
    entity: Entity,
    relationName: string,
    relationIds: (string | number)[],
    opts?: ModifyRelationOptions<Entity, Relation>
  ): Promise<Entity> {
    const relationMetadata = this.getRelationMeta(relationName);

    if (relationMetadata.inverseEntityMetadata.hasMultiplePrimaryKeys) {
      throw new Error(`App query service not supported multiple primary keys`);
    }

    const relationPrimaryKeyName = relationMetadata.inverseEntityMetadata.primaryColumns[0].propertyName;
    const existingRelations = await this.createTypeormRelationQueryBuilder(
      entity  ,
      relationName,
    ).loadMany();

    const newRelations = await this.getRelations(
      relationName,
      [...relationIds].filter((id) => !existingRelations.find((r) => r[relationPrimaryKeyName as keyof Relation] === id)),
      opts?.relationFilter
    );

    if (existingRelations) {
      existingRelations.forEach((r, key) => {
        if (![...relationIds].includes(r[relationPrimaryKeyName as keyof Relation] as string)) {
          delete existingRelations[key];
        }
      });
    }

    relationMetadata.setEntityValue(entity, [...existingRelations, ...newRelations]);

    return entity;
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

  private copyRegularColumn(record: DeepPartial<Entity>, entity: Entity ): void {
    this.repo.metadata.nonVirtualColumns.forEach((column) => {
      const objectColumnValue = column.getEntityValue(record)
      if (objectColumnValue !== undefined)
          column.setEntityValue(entity, objectColumnValue)
    })
  }
}
