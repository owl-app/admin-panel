import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface';

import { User } from '../../../domain/model/user';
import { InvalidAuthenticationError } from '../../../domain/auth.errors';

import { IUserRepository } from '../../../database/repository/user-repository.interface';

import { UserResponse } from '../../dto/user.response';
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
    private readonly jwtTokenService: IJwtTokenService<User>,
    @Inject(IUserRepository)
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
      user: userMapper.map<User, UserResponse>(user, new UserResponse()),
      accessToken,
      refreshToken,
    };
  }
}
