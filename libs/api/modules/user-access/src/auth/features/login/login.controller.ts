import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { IAuthResponse, IUser } from '@owl-app/lib-contracts'
import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface'
import { Public } from '@owl-app/lib-api-bulding-blocks/passport/jwt.guard'

import { AuthRequest } from './dtos/auth.request'

import type RequestWithUser from './request-with-user.interface'

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
export class LoginController {
  constructor(
    @Inject(IJwtTokenService)
    private readonly jwtTokenService: IJwtTokenService<IUser>,
  ) {}

  @ApiOperation({ description: 'login' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthRequest })
  @UseGuards(AuthGuard('local'))
  @Public()
  @ApiResponse({ status: HttpStatus.OK })
  @Post('/login')
  async login(@Body() auth: AuthRequest, @Request() request: RequestWithUser): Promise<IAuthResponse> {
    const { user } = request;

    const accessToken = await this.jwtTokenService.getJwtToken(user.email);
    const refreshToken = await this.jwtTokenService.getJwtRefreshToken(user.email);

    return {
      user,
      accessToken,
      refreshToken
    }
  }
}
