import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Public } from '@owl-app/lib-api-bulding-blocks/metadata/route'
import { ApiErrorValidationResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error-validation.response'
import { ApiErrorResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error.response'

import { InvalidAuthenticationError } from '../../../domain/auth.errors'

import { AuthResponse } from './dto/auth.response'
import { AuthRequest } from './dto/auth.request'
import { Login } from './login.service'


@Controller('auth')
@ApiTags('Auth')
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
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation errors.',
    type: ApiErrorValidationResponse
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: InvalidAuthenticationError.message,
    type: ApiErrorResponse
  })
  @Post('/login')
  async login(@Body() auth: AuthRequest): Promise<AuthResponse> {
    try {
      const result = await this.commandBus.execute(new Login(auth));

      return result;
    } catch (error: unknown) {
      if(error instanceof InvalidAuthenticationError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
