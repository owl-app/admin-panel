import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUser } from '@owl-app/lib-contracts';
import { User } from '../../../domain';

import { IUserRepository } from '../../../domain/repository/user-repository.interface';

@Injectable()
export class UserRepository extends Repository<User> implements IUserRepository {

  constructor(
    @InjectRepository(User)
    userEntityRepository: Repository<User>,
  ) {
    super(userEntityRepository.target, userEntityRepository.manager, userEntityRepository.queryRunner);
  }

  async findOneByIdString(id: string): Promise<IUser>
  {
    const adminUserEntity = await this.findOne({
      where: {
        id,
      },
    });
    if (!adminUserEntity) {
      return null;
    }
    return this.toUser(adminUserEntity);
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const adminUserEntity = await this.findOne({
      where: {
        email,
      },
    });
    if (!adminUserEntity) {
      return null;
    }
    return this.toUser(adminUserEntity);
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

  private toUser(adminUserEntity: IUser): IUser {
    const adminUser: IUser = new User();

    adminUser.id = adminUserEntity.id;
    adminUser.email = adminUserEntity.email;
    adminUser.firstName = adminUserEntity.firstName;
    adminUser.lastName = adminUserEntity.lastName;

    return adminUser;
  }
}
