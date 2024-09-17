import { EntitySchema } from 'typeorm';

import { USER_ENTITY, COMPANY_ENTITY } from '@owl-app/lib-api-core/entity-tokens';

import { CompanyEntity } from '../../domain/entity/company.entity';

export const CompanyEntitySchema = new EntitySchema<CompanyEntity>({
  target: CompanyEntity,
  name: COMPANY_ENTITY,
  tableName: 'company',
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
    },
    address: {
      type: String,
    },
  },
  relations: {
    users: {
      type: 'one-to-many',
      target: USER_ENTITY,
      cascade: true,
      inverseSide: 'company'
    },
  },
});
