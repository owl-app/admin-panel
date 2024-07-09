import { EntitySchema } from 'typeorm';

import { User } from '../../domain/model/user';

export const UserEntity = new EntitySchema<User>({
  target: User,
  name: 'User',
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
    companies: {
      type: 'many-to-many',
      target: 'Company',
      joinTable: {
        name: 'user_company',
        joinColumn: {
          name: 'user_id',
          referencedColumnName: "id"
        },
        inverseJoinColumn: {
          name: 'company_id'
        },
      },
      inverseSide: 'users',
    },
  },
});
