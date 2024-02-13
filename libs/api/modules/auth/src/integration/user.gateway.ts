import { Inject, Injectable } from '@nestjs/common';
import { IUser } from '@owl-app/lib-contracts';

import { IUserFacade } from '@owl-app/lib-api-module-user/integration/user.facade';

export interface IUserGateway {

  getUserByEmail(email: string): Promise<IUser>;

  updateLastLogin(username: string): Promise<void>;

  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
}

export const IUserGateway = Symbol('IUserGateway');

@Injectable()
export class UserGateway implements IUserGateway {

  constructor(
    @Inject(IUserFacade)
    readonly userFacade: IUserFacade
  ) {}

  async getUserByEmail(email: string): Promise<IUser>
  {
    const user = await this.userFacade.getUserByEmail(email);

    return user;
  }

  async updateLastLogin(username: string): Promise<void>
  {
    await this.userFacade.updateLastLogin(username);
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void>
  {
    this.userFacade.updateRefreshToken(email, refreshToken);
  }
}
