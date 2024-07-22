import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface';
import { InjectRepository } from '@owl-app/lib-api-bulding-blocks/typeorm/common/tenant-typeorm.decorators';

import { UserEntity } from '../../../domain/entity/user.entity';
import { InvalidAuthenticationError } from '../../../domain/auth.errors';

import type { IUserRepository } from '../../../database/repository/user-repository.interface';

import { UserResponseAuth } from '../../dto/user.response';
import userMapper from '../../mapping';

import { loginValidation } from './validation';
import { AuthResponse } from './dto/auth.response';

export class Login {
  email: string;

  password: string;

  constructor(request: Partial<Login> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(Login)
export class LoginHandler implements ICommandHandler<Login> {
  constructor(
    @Inject(IJwtTokenService)
    private readonly jwtTokenService: IJwtTokenService<UserEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: Login): Promise<AuthResponse> {
    await loginValidation.validateAsync(command, { abortEarly: false });

    const user = await this.userRepository.getUserByEmail(command.email);

    if (!user || !await this.jwtTokenService.validateToken(command.password, user.passwordHash)
    ) {
      throw new InvalidAuthenticationError();
    }

    await this.userRepository.updateLastLogin(user.email);

    const accessToken = await this.jwtTokenService.getJwtToken(command.email);
    const refreshToken = await this.jwtTokenService.getJwtRefreshToken(command.email);

    return {
      user: userMapper.map<UserEntity, UserResponseAuth>(user, new UserResponseAuth()),
      accessToken,
      refreshToken,
    };
  }
}
