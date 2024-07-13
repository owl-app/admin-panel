import { EntityManager, EntityTarget, QueryRunner } from 'typeorm';
import { User } from '@owl-app/lib-contracts';
import { Registry } from '@owl-app/registry';
import { TenantRepository } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant.repository';
import { TenantFilter } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/filters/tenant.filter';

import { UserEntity } from '../../domain/entity/user.entity';

import { IUserRepository } from './user-repository.interface';

export class UserRepository extends TenantRepository<UserEntity> implements IUserRepository {

  constructor(
    target: EntityTarget<UserEntity>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
    readonly filters?: Registry<TenantFilter<UserEntity>>,
  ) {
    super(target, manager, queryRunner, filters);
  }

  async findOneByIdString(id: string): Promise<User>
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

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      where: {
        email,
      },
      select: {
        companies: {
          id: true,
        }
      },
      relations: {
        companies: true,
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
