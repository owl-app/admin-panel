import { EntityMetadata, SelectQueryBuilder } from "typeorm";

export interface TenantSetter<Entity>
{
    supports(metadata: EntityMetadata): boolean

    execute(qb: SelectQueryBuilder<Entity>): void;
}
