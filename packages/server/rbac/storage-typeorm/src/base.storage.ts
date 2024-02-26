import { DataSource, QueryRunner } from "typeorm"

export class BaseStorage {
  constructor(protected dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  protected async transactional(callback: (queryRunner: QueryRunner) => Promise<any>): Promise<void>
  {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction()

    try {
      await callback(queryRunner);

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }
  }

  protected async singleQuery(sql: string, parameters?: any[]): Promise<any> 
  {
    const queryRunner = this.dataSource.createQueryRunner();
    const result = await queryRunner.query(sql, parameters);
    queryRunner.release();

    return result;
  }
}