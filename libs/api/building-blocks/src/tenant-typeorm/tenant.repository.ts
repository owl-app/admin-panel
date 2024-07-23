import { Registry } from '@owl-app/registry';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  QueryRunner,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { TenantFilter } from './filters/tenant.filter';
import { TenantSetter } from './setters/tenant.setter';
import { BaseRepository } from '../database/repository/base.repository';
import BaseEntity from '../database/entity/base.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class TenantRepository<Entity extends BaseEntity> extends BaseRepository<Entity> {

  constructor(
    target: EntityTarget<Entity>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
    readonly filters?: Registry<TenantFilter<Entity>>,
    readonly setters?: Registry<TenantSetter<Entity>>,
    readonly eventEmitter?: EventEmitter2
  ) {
    super(target, manager, queryRunner, eventEmitter);
  }

  override createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<Entity> {
    const qb = super.createQueryBuilder(alias, queryRunner);

    const filters = this.filters?.all();

    if (filters) {
      Object.entries(filters).forEach((filter) => {
        if (filter[1].supports(this.metadata)) {
          filter[1].execute(qb);
        } 
        
      })
    }

    return qb;
  }

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  override save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false }
  ): Promise<T[]>;

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  override save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions
  ): Promise<(T & Entity)[]>;

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  override save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false }
  ): Promise<T>;

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  override save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions
  ): Promise<T & Entity>;

  /**
   * Saves one or many given entities.
   */
  override save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions
  ): Promise<T | T[]> {
    const setters = this.setters?.all();

    if (setters) {
      Object.entries(setters).forEach((filter) => {
        if (filter[1].supports(this.metadata)) {
          filter[1].execute(entityOrEntities);
        } 
      })
    }

    return super.save(
      entityOrEntities as any,
      options
    );
  }
}
