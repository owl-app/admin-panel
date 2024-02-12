import { Controller, Get, HttpStatus, Inject, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IS_AUTHENTICATED_USECASE, IsAuthenticatedUseCase } from '../../../application/is-authenticated';

import type RequestWithUser from '../../../infrastructure/http/request-with-user.interface';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class IsAuthenticatedController {
  constructor(
    @Inject(IS_AUTHENTICATED_USECASE)
    private readonly isAuthenticatedUseCase: IsAuthenticatedUseCase,
  ) {}

  @ApiOperation({ description: 'Check user is authenticated' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The success server response',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST, 
  })
  @Get('/authenticated')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async isAuthenticated(@Request() request: RequestWithUser): Promise<boolean> {
    const { user } = request;
    const isAuthenticated = await this.isAuthenticatedUseCase.execute(user.email);

    return isAuthenticated;
  }
}
