import { EntityMetadata, SelectQueryBuilder } from "typeorm";

export interface TenantFilter<Entity>
{
    supports(metadata: EntityMetadata): boolean

    execute(queryBuilder: SelectQueryBuilder<Entity>): void;
}
