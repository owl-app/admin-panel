import { Controller, Get, HttpStatus, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/infrastructure/context';

import { UserWithPermissionResponse } from './dto/user-with-permission.response';

import { GET_ME_USECASE, GetMeUseCase } from '../../../application/get-me';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class GetMeController {
  constructor(
    @Inject(GET_ME_USECASE)
    private readonly getMeUseCase: GetMeUseCase,
    private requestContextService: AppRequestContextService
  ) {}

  @ApiOperation({ description: 'login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found current user',
    type: UserWithPermissionResponse
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found'
  })
  @Get('/me')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getMe(): Promise<UserWithPermissionResponse> {
    const userWithPermission = await this.getMeUseCase.execute(this.requestContextService.currentRequestId);

    return userWithPermission;
  }
}
