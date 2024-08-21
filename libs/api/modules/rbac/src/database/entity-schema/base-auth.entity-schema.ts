import { EntitySchema } from 'typeorm';

import { BASE_AUTH_ENITY } from '@owl-app/lib-api-bulding-blocks/entity-tokens';
import { TimestampableSchemaPart } from '@owl-app/lib-api-bulding-blocks/database/entity-schema/timestampable.schemat';

import { BaseAuthItemEntity } from '../../domain/entity/base-auth.entity';

export const BaseAuthEntitySchema = new EntitySchema<BaseAuthItemEntity>({
  target: BaseAuthItemEntity,
  tableName: 'rbac_item',
  name: BASE_AUTH_ENITY,
  columns: {
    type: {
      type: String,
    },
    name: {
      type: String,
      primary: true,
    },
    description: {
      type: String,
      nullable: true,
    },
    ruleName: {
      name: "rule_name",
      type: String,
      nullable: true,
    },
    ...TimestampableSchemaPart
  },
  inheritance: {
    pattern: "STI",
    column: "type",
  },
});
