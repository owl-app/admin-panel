import { EntitySchema } from 'typeorm';

import { CLIENT_ENTITY, COMPANY_ENTITY } from '@owl-app/lib-api-bulding-blocks/entity-tokens';

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
  },
  relations: {
    company: {
      type: 'many-to-one',
      target: COMPANY_ENTITY,
      joinColumn: {
        name: 'company_id',
      },
    }
  },
});
