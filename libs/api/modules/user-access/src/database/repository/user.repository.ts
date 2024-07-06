import { EntityManager, EntityTarget, QueryRunner } from 'typeorm';
import { IUser } from '@owl-app/lib-contracts';
import { Registry } from '@owl-app/registry';
import { TenantRepository } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant.repository';
import { TenantFilter } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/filters/tenant-filter';

import { User } from '../../domain/model/user';

import { IUserRepository } from './user-repository.interface';

export class UserRepository extends TenantRepository<User> implements IUserRepository {

  constructor(
    target: EntityTarget<User>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
    readonly filters?: Registry<TenantFilter>,
  ) {
    super(target, manager, queryRunner, filters);
  }

  async findOneByIdString(id: string): Promise<IUser>
  {
    let user = null;

    if(id) {
      user = await this.findOne({
        where: {
          id,
        },
      });
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.update(
      {
        email,
      },
      { 
        hashRefreshToken: refreshToken 
      },
    );
  }

  async updateLastLogin(email: string): Promise<void> {
    await this.update(
      {
        email,
      },
      {
        lastLogin: () => 'CURRENT_TIMESTAMP'
      },
    );
  }
}
