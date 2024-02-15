import { Inject } from '@nestjs/common';
import { IUserWithPermission } from '@owl-app/lib-contracts';

import { IUserRepository } from '../domain';

export const GET_ME_USECASE = 'GetMeUseCase';

export class GetMeUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id:  string): Promise<IUserWithPermission> {
    const user = await this.userRepository.findOneByIdString(id);

    return {
      user
    }
  }
}
