import { Inject } from '@nestjs/common';
import { IUser } from '@owl-app/lib-contracts';

import { IUserRepository } from '../domain/repository/user-repository.interface';

export const IS_AUTHENTICATED_USECASE = 'IsAuthenticatedUseCase';

export class IsAuthenticatedUseCase {
  constructor(
    @Inject(IUserRepository)
    readonly userRepository: IUserRepository
  ) {}

  async execute(email: string): Promise<boolean> {
    const user: IUser = await this.userRepository.getUserByEmail(email);

    return !!user;
  }
}