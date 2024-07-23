import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  QueryRunner,
  Repository,
  SaveOptions,
} from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RequestContextService } from '../../context/app-request-context';
import BaseEntity from '../entity/base.entity';

export class BaseRepository<Entity extends BaseEntity> extends Repository<Entity> {

  constructor(
    target: EntityTarget<Entity>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
    readonly eventEmitter?: EventEmitter2
  ) {
    super(target, manager, queryRunner);
  }

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  override async save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false }
  ): Promise<T[]>;

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  override async save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions
  ): Promise<(T & Entity)[]>;

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  override async save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false }
  ): Promise<T>;

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  override async save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions
  ): Promise<T & Entity>;

  /**
   * Saves one or many given entities.
   */
  override async save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions
  ): Promise<T | T[]> {
    const savedEntity = await this.getManager().save<Entity, T>(
      this.metadata.target as any,
      entityOrEntities as any,
      options,
    );

    await Promise.all(
      (!Array.isArray(savedEntity) ? [savedEntity] : savedEntity).map(async (entity) => {
        await entity.publishEvents(entity.id, this.eventEmitter);
      })
    );

    return savedEntity;
  }

  /**
   * start a global transaction to save
   * results of all event handlers in one operation
   */
  public async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.manager.transaction(async (connection) => {
      if (!RequestContextService.getTransactionConnection()) {
        RequestContextService.setTransactionConnection(connection);
      }

      try {
        const result = await handler();

        return result;
      } finally {
        RequestContextService.cleanTransactionConnection();
      }
    });
  }

  /**
 * Get database manager.
 * If global request transaction is started,
 * returns a transaction manager.
 */
  protected getManager(): EntityManager {
    return (
      RequestContextService.getContext().transactionManager ?? this.manager
    );
  }
}
