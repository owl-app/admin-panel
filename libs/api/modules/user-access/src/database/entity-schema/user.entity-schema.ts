import { EntitySchema } from 'typeorm';

import { USER_ENTITY, COMPANY_ENTITY, TENANT_ENTITY } from '@owl-app/lib-api-bulding-blocks/entity-tokens';

import { UserEntity } from '../../domain/entity/user.entity';

export const UserEntitySchema = new EntitySchema<UserEntity>({
  target: UserEntity,
  name: USER_ENTITY,
  tableName: 'user',
  columns: {
    id: {
      type: String,
      generated: 'uuid',
      primary: true,
    },
    email: {
      type: String,
    },
    username: {
      type: String,
      nullable: true,
    },
    firstName: {
      type: String,
      name: 'first_name',
      nullable: true,
    },
    lastName: {
      type: String,
      name: 'last_name',
      nullable: true,
    },
    phoneNumber: {
      type: String,
      name: 'phone_number',
      nullable: true,
    },
    passwordHash: {
      type: String,
      name: 'password_hash',
      nullable: true,
    },
    isActive: {
      type: Boolean,
      name: 'is_active',
      default: 0,
    },
    hashRefreshToken: {
      type: 'varchar',
      name: 'hash_refresh_token',
      nullable: true,
    },
    lastLogin: {
      type: Date,
      name: 'last_login',
      nullable: true,
    },
  },
  relations: {
    company: {
      type: 'many-to-one',
      target: COMPANY_ENTITY,
      joinColumn: {
        name: 'company_id',
      },
      inverseSide: 'users'
    },
    tenant: {
      type: 'many-to-one',
      target: TENANT_ENTITY,
      cascade: true,
      joinColumn: {
        name: 'tenant_id',
      },
    },
  },
});
