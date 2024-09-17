import * as bcrypt from 'bcrypt'
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { APP_CONFIG_NAME, IConfigApp } from '@owl-app/lib-api-core/config';
import { InjectQueryServiceRepository } from '@owl-app/lib-api-core/crud/common/repository.decorator'

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
    @InjectQueryServiceRepository(UserEntity)
    readonly userRepository: IUserRepository,
    @Inject(ConfigService)
    readonly configService: ConfigService
  ) {}

  async execute(command: RegistrationCommand): Promise<void> {
    await registrationValidation.validateAsync(command, { abortEarly: false });

    const { password_bcrypt_salt_rounds } = this.configService.get<IConfigApp>(APP_CONFIG_NAME);
    const user = UserEntity.register({
      ...command,
      passwordHash: await bcrypt.hash(command.password, password_bcrypt_salt_rounds)
    });

    await this.userRepository.register(user);
  }
}
