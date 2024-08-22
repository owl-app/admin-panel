import { EntitySchema } from 'typeorm';

import { PERMISSION_ENITY } from '@owl-app/lib-api-bulding-blocks/entity-tokens';

import { PermissionEntity } from "../../domain/entity/permission.entity";
import { BaseAuthEntitySchema } from './base-auth.entity-schema';

export const PermissionEntitySchema = new EntitySchema<PermissionEntity>({
  target: PermissionEntity,
  name: PERMISSION_ENITY,
  type: "entity-child",
  // When saving instances of 'A', the "type" column will have the value
  // specified on the 'discriminatorValue' property
  discriminatorValue: 'permission',
  columns: {
      ...BaseAuthEntitySchema.options.columns,
  },
})