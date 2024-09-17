import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';

import { TIME_ENTITY, TENANT_ENTITY, USER_ENTITY } from '@owl-app/lib-api-core/entity-tokens';
import { TimestampableSchemaPart } from '@owl-app/lib-api-core/database/entity-schema/timestampable.schemat';

import { TimeEntity } from '../../domain/entity/time.entity';

export const TimeEntitySchema = new EntitySchema<TimeEntity>({
  target: TimeEntity,
  name: TIME_ENTITY,
  tableName: 'time',
  columns: {
    id: {
      type: String,
      generated: 'uuid',
      primary: true,
    },
    description: {
      type: String,
      nullable: true,
    },
    timeIntervalStart: {
      name: "time_interval_start",
      type: "datetime",
    } as EntitySchemaColumnOptions,
    timeIntervalEnd: {
      name: "time_interval_end",
      type: "datetime",
      nullable: true,
    } as EntitySchemaColumnOptions,
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
    user: {
      type: 'many-to-one',
      target: USER_ENTITY,
      joinColumn: {
        name: 'user_id',
      },
      inverseSide: 'times'
    },
  },
});
