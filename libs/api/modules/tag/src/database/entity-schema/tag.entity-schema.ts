import { EntitySchema } from 'typeorm';

import { TAG_ENTITY, TENANT_ENTITY } from '@owl-app/lib-api-core/entity-tokens';
import { TimestampableSchemaPart } from '@owl-app/lib-api-core/database/entity-schema/timestampable.schemat';

import { TagEntity } from '../../domain/entity/tag.entity';

export const TagEntitySchema = new EntitySchema<TagEntity>({
  target: TagEntity,
  name: TAG_ENTITY,
  tableName: 'tag',
  columns: {
    id: {
      type: String,
      generated: 'uuid',
      primary: true,
    },
    name: {
      type: String,
    },
    ...TimestampableSchemaPart
  },
  relations: {
    tenant: {
      type: 'many-to-one',
      target: TENANT_ENTITY,
      // cascade: true,
      joinColumn: {
        name: 'tenant_id',
      },
    },
  },
});