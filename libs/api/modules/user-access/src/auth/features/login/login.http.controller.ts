import { Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@owl-app/lib-api-bulding-blocks/metadata/route';
import { ApiErrorValidationResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error-validation.response';
import { ApiErrorResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error.response';
import { Token } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface';

import { InvalidAuthenticationError } from '../../../domain/auth.errors';

import { AuthResponse } from './dto/auth.response';
import { AuthRequest } from './dto/auth.request';
import { Login } from './login.service';

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
    type: ApiErrorValidationResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: InvalidAuthenticationError.message,
    type: ApiErrorResponse,
  })
  @Post('/login')
  async login(
    @Body() auth: AuthRequest,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponse> {
    try {
      const result = await this.commandBus.execute<Login, Record<'accessToken' | 'refreshToken', Token>>(new Login(auth));

      response.cookie('access_token', result.accessToken.token, {
        httpOnly: true,
        secure: true,
        maxAge: result.accessToken.expiresIn,
      });

      response.cookie('refresh_token', result.refreshToken.token, {
        httpOnly: true,
        secure: true,
        maxAge:result.refreshToken.expiresIn,

      });

      return {
        accessTokenExpires: result.accessToken.expiresIn,
        refreshTokenExpires: result.refreshToken.expiresIn
      };
    } catch (error: unknown) {
      if (error instanceof InvalidAuthenticationError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
