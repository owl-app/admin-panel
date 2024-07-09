import { EntitySchema } from 'typeorm';

import type { Company, IUser } from '@owl-app/lib-contracts'

import { CompanyModel } from '../../domain/model/company';

import {UserEntity} from '@owl-app/lib-api-module-user-access/database/entity/user.entity';

import { User } from '@owl-app/lib-api-module-user-access/domain/model/user';

export const CompanyEntity = new EntitySchema<CompanyModel>({
  target: CompanyModel,
  name: 'CompanyModel',
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
        target: UserEntity,
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
