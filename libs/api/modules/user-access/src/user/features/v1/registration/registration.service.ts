import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@owl-app/lib-api-bulding-blocks/typeorm/common/tenant-typeorm.decorators';

import { UserEntity } from '../../../../domain/entity/user.entity';
import type { IUserRepository } from '../../../../database/repository/user-repository.interface';

import { registrationValidation } from './validation';

export class RegistrationCommand {
  email: string;
  password: string;
  phoneNumber: string;

  constructor(request: Partial<RegistrationCommand> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(RegistrationCommand)
export class RegistrationHandler implements ICommandHandler<RegistrationCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: RegistrationCommand): Promise<void> {
    await registrationValidation.validateAsync(command, { abortEarly: false });

    const user = UserEntity.register(command);

    await this.userRepository.register(user);
  }
}
