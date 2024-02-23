import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Public } from '@owl-app/lib-api-bulding-blocks/passport/jwt.guard'

import { AuthResponse } from './dto/auth.response'
import { AuthRequest } from './dto/auth.request'
import { Login } from './login.service'


@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
export class LoginController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ description: 'login' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthRequest })
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged.',
    type: AuthResponse,
  })
  @Post('/login')
  async login(@Body() auth: AuthRequest): Promise<AuthResponse> {
    const result = await this.commandBus.execute(new Login(auth));

    return result;
  }
}
