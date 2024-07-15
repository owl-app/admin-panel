import { DeepPartial, EntityMetadata } from "typeorm";

export interface TenantSetter<Entity>
{
    supports(metadata: EntityMetadata): boolean;

    execute<T extends DeepPartial<Entity>>(entityOrEntities: T | T[],): void
}
