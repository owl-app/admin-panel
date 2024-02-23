import { Inject } from "@nestjs/common"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ValidationError } from 'joi'

import { IJwtTokenService } from "@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface"
import { ApplicationException } from '@owl-app/lib-api-bulding-blocks/types/exceptions/application.exception'

import { User } from '../../../domain/model/user'
import { UserResponse } from "../../dto/user.response"
import userMapper from '../../mapping'

import { loginValidation } from "./validation"
import { AuthResponse } from "./dto/auth.response"

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
        @Inject(IJwtTokenService) private readonly jwtTokenService: IJwtTokenService<User>
    ) {}

    async execute(command: Login): Promise<AuthResponse> {
      await loginValidation.validateAsync(command, { abortEarly: false });
  
      const user = await this.jwtTokenService.validateUserForLocalStragtegy(command.email, command.password);

      if (!user) {
        const itemError = 
          {
            message: 'Invalid email or password.',
            path: ['common'],
            type: ''
          }
        throw new ValidationError('Invalid email or password.', [itemError], '')
      }

      const accessToken = await this.jwtTokenService.getJwtToken(user.email);
      const refreshToken = await this.jwtTokenService.getJwtRefreshToken(user.email);
  
      return {
        user: userMapper.map<User, UserResponse>(user, new UserResponse()),
        accessToken,
        refreshToken
      }
    }
}