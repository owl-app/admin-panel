import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export interface TenantFilter
{
    execute(queryBuilder: SelectQueryBuilder<ObjectLiteral>): void;
}
