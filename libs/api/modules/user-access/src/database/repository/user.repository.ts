import { EntityManager, EntityTarget, QueryRunner, Repository } from 'typeorm';
import { User } from '@owl-app/lib-contracts';

import { UserEntity } from '../../domain/entity/user.entity';

import { IUserRepository } from './user-repository.interface';

export class UserRepository extends Repository<UserEntity> implements IUserRepository {

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
        company: {
          id: true,
        }
      },
      relations: {
        tenant: true,
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
