import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUser } from '@owl-app/lib-contracts';
import { Registry } from '@owl-app/registry';
import { TenantRepository } from '@owl-app/lib-api-bulding-blocks/tenant/tenant.repository';
import { TenantFilter } from '@owl-app/lib-api-bulding-blocks/tenant/filters/tenant-filter';
import { FILTER_REGISTRY_TENANT } from '@owl-app/lib-api-bulding-blocks/constants';

import { User } from '../../domain/model/user';

import { IUserRepository } from './user-repository.interface';

@Injectable()
export class UserRepository extends TenantRepository<User> implements IUserRepository {

  constructor(
    @InjectRepository(User)
    userEntityRepository: Repository<User>,
    @Inject(FILTER_REGISTRY_TENANT)
    filters: Registry<TenantFilter>,
  ) {
    super(userEntityRepository, filters);
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

  async updateLastLogin(username: string): Promise<void> {
    await this.update(
      {
        username,
      },
      {
        lastLogin: () => 'CURRENT_TIMESTAMP'
      },
    );
  }

  private toUser(user: IUser): IUser {
    const userDomain: IUser = new User();

    userDomain.id = user.id;
    userDomain.email = user.email;
    userDomain.firstName = user.firstName;
    userDomain.lastName = user.lastName;
    userDomain.passwordHash = user.passwordHash;

    return userDomain;
  }
}
