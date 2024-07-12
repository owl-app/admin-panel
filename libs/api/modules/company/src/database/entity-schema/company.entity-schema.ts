import { EntitySchema } from 'typeorm';

import { USER_ENTITY, COMPANY_ENTITY } from '@owl-app/lib-api-bulding-blocks/entity-tokens';

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
  },
  relations: {
    users: {
        type: 'many-to-many',
        target: USER_ENTITY,
        joinTable: {
          name: 'user_company',
          joinColumn: {
            name: 'company_id',
          },
          inverseJoinColumn: {
            name: 'user_id'
          },
        },
        inverseSide: 'companies',
        cascade: true,
      },
  },
});
