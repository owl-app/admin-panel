import { Controller, Get, HttpStatus, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/context/app-request-context.service';

import { UserWithPermissionResponse } from './dto/user-with-permission.response';

import { IUserRepository } from '../../../database/repository/user-repository.interface';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class GetMeController {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
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
    const user = await this.userRepository.findOneByIdString(this.requestContextService.currentRequestId);

    return {
      user
    };
  }
}
