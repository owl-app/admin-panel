import { EntitySchema } from 'typeorm';

import { CompanyEntity } from '../../domain/entity/company.entity';

export const CompanyEntitySchema = new EntitySchema<CompanyEntity>({
  target: CompanyEntity,
  name: 'CompanyEntity',
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
        target: 'UserEntity',
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
