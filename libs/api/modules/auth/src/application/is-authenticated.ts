import { Inject } from '@nestjs/common';
import { IUser } from '@owl-app/lib-contracts';
import { IUserGateway } from '../integration/user.gateway';

export const IS_AUTHENTICATED_USECASE = 'IsAuthenticatedUseCase';

export class IsAuthenticatedUseCase {
  constructor(
    @Inject(IUserGateway)
    readonly userGateway: IUserGateway
  ) {}

  async execute(email: string): Promise<boolean> {
    const user: IUser = await this.userGateway.getUserByEmail(email);

    return user ? true : false;
    // const { passwordHash, ...info } = user;
    // return info;
  }
}