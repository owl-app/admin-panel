import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAuthResponse, IUser } from '@owl-app/lib-contracts';

import { AuthRequest } from './dtos/auth.request';

import { LOGIN_USECASE, LoginUseCase } from '../../../application/login';

import { LocalAuthGuard } from '../../../infrastructure/jwt/guards/local-auth.guard';
import type RequestWithUser from '../../../infrastructure/http/request-with-user.interface';
import { Public } from '../../../infrastructure/jwt/guards/jwt-auth.metadata';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
export class LoginController {
  constructor(
    @Inject(LOGIN_USECASE)
    private readonly loginUseCase: LoginUseCase<IUser>,
  ) {}

  @ApiOperation({ description: 'login' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthRequest })
  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiResponse({ status: HttpStatus.OK })
  @Post('/login')
  async login(@Body() auth: AuthRequest, @Request() request: RequestWithUser): Promise<IAuthResponse> {
    const { user } = request;

    const tokens = await this.loginUseCase.execute(auth.email);

    return {
      user,
      ...tokens
    }
  }
}
