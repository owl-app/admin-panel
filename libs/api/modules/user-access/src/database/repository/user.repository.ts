import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUser } from '@owl-app/lib-contracts';

import { User } from '../../domain/model/user';

import { IUserRepository } from './user-repository.interface';

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
    const user = await this.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return null;
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
