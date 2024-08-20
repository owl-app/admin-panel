import { EntitySchema } from 'typeorm';

import { CLIENT_ENTITY, TENANT_ENTITY } from '@owl-app/lib-api-bulding-blocks/entity-tokens';

import { ClientEntity } from '../../domain/entity/client.entity';

export const ClientEntitySchema = new EntitySchema<ClientEntity>({
  target: ClientEntity,
  name: CLIENT_ENTITY,
  tableName: 'client',
  columns: {
    id: {
      type: String,
      generated: 'uuid',
      primary: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      nullable: true,
    },
    address: {
      type: String,
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    }
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
