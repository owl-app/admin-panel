import {
  DeepPartial,
  QueryRunner,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';

export class TenantRepository<Entity> extends Repository<Entity> {

  constructor(
    repo: Repository<Entity>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  override createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<Entity> {
    const qb = this.manager.createQueryBuilder<Entity>(
      this.metadata.target as any,
      alias || this.metadata.targetName,
      queryRunner || this.queryRunner
    );

    console.log('createQueryBuilder', qb.alias);

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
    return this.manager.save<Entity, T>(
      this.metadata.target as any,
      entityOrEntities as any,
      options
    );
  }
}
