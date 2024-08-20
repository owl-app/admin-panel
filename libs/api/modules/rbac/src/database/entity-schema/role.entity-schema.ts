import { EntitySchema } from 'typeorm';

import { ROLE_ENTITY, ROLE_SETTING_ENTITY } from '@owl-app/lib-api-bulding-blocks/entity-tokens';

import { RoleEntity } from "../../domain/entity/role.entity";
import { BaseAuthEntitySchema } from './base-auth.entity-schema';

export const RoleEntitySchema = new EntitySchema<RoleEntity>({
  target: RoleEntity,
  name: ROLE_ENTITY,
  type: "entity-child",
  // When saving instances of 'A', the "type" column will have the value
  // specified on the 'discriminatorValue' property
  discriminatorValue: 'role',
  columns: {
      ...BaseAuthEntitySchema.options.columns,
  },
  relations: {
    setting: {
      type: 'one-to-one',
      target: ROLE_SETTING_ENTITY,
      inverseSide: 'role',
    }
  },
})