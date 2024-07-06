import { Registry } from '@owl-app/registry';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  QueryRunner,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { TenantFilter } from './filters/tenant-filter';

export class TenantRepository<Entity> extends Repository<Entity> {

  constructor(
    target: EntityTarget<Entity>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
    readonly filters?: Registry<TenantFilter>,
  ) {
    super(target, manager, queryRunner);
  }

  override createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<Entity> {
    const qb = super.createQueryBuilder(alias, queryRunner);

    console.log('createQueryBuilder', this.filters);

    // qb.andWhere(`${qb.alias}.email = :tenantId`, { tenantId: 'test' });

    // qb.andWhere(`${qb.alias}.company_id = :tenantId`, {tenantId : '1'});

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
    // (entityOrEntities as any).email = 'test';
    return this.manager.save<Entity, T>(
      this.metadata.target as any,
      entityOrEntities as any,
      options
    );
  }
}
