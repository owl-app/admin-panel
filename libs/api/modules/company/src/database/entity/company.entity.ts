import { EntitySchema } from 'typeorm';

import { Company } from '../../domain/model/company';

export const CompanyEntity = new EntitySchema<Company>({
  target: Company,
  name: 'Company',
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
        target: 'User',
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
