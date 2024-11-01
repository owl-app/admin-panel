import { RequestContextService } from "@owl-app/lib-api-core/context/app-request-context"
import { RolesEnum } from "@owl-app/lib-contracts"
import { DataSource as BaseDataSource, EntityTarget, InstanceChecker, ObjectLiteral, QueryRunner, SelectQueryBuilder, TypeORMError } from "typeorm"
import { DriverUtils } from "typeorm/driver/DriverUtils"

export class DataSource extends BaseDataSource {
    /**
     * Creates a new query builder that can be used to build a SQL query.
     */
      createQueryBuilder<Entity extends ObjectLiteral>(
        entityClass: EntityTarget<Entity>,
        alias: string,
        queryRunner?: QueryRunner,
    ): SelectQueryBuilder<Entity>

    /**
     * Creates a new query builder that can be used to build a SQL query.
     */
    createQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<any>

    /**
     * Creates a new query builder that can be used to build a SQL query.
     */
    createQueryBuilder<Entity extends ObjectLiteral>(
        entityOrRunner?: EntityTarget<Entity> | QueryRunner,
        alias?: string,
        queryRunner?: QueryRunner,
    ): SelectQueryBuilder<Entity> {
        const selectQueryBuilder = super.createQueryBuilder<Entity>(entityOrRunner as EntityTarget<Entity>, alias, queryRunner);

        if (RequestContextService.getCurrentUser() &&
          RequestContextService.getCurrentUser()?.roles?.includes(
          RolesEnum.ROLE_USER
        )) {
          selectQueryBuilder.expressionMap.withDeleted = false;
        } else {
          selectQueryBuilder.expressionMap.withDeleted = true;
        }

        return selectQueryBuilder;
    }
}
