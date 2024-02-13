import { Inject, Injectable } from '@nestjs/common';
import { IUser, IUserWithPermission } from '@owl-app/lib-contracts';

import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/infrastructure/context';

import { IUserRepository } from '../domain';

export interface IUserFacade {
  getUserByEmail(email: string): Promise<IUser>;

  updateLastLogin(username: string): void;

  updateRefreshToken(username: string, refreshToken: string): void;

  getUserByIdWithPermission(): Promise<IUserWithPermission>;
}

export const IUserFacade = Symbol('IUserFacade');

@Injectable()
export class UserFacade implements IUserFacade {

  constructor(
    @Inject(IUserRepository)
    readonly userRepository: IUserRepository,
    private requestContextService: AppRequestContextService
  ) {}

  async getUserByEmail(email: string): Promise<IUser>
  {
    const user = await this.userRepository.getUserByEmail(email);

    return user;
  }

  updateLastLogin(username: string): void
  {
    this.userRepository.updateLastLogin(username);
  }

  updateRefreshToken(email: string, refreshToken: string): void
  {
    this.userRepository.updateRefreshToken(email, refreshToken);
  }

  async getUserByIdWithPermission(): Promise<IUserWithPermission>
  {
    const user = await this.userRepository.findOneByIdString(this.requestContextService.currentUserId);

    return {
      user
    }
  }
}