import { Controller, Get, HttpStatus, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RequestContextService } from '@owl-app/lib-api-bulding-blocks/context/app-request-context';

import { User } from '../../../domain/model/user'

import { IUserRepository } from '../../../database/repository/user-repository.interface';

import userMapper from '../../mapping'
import { UserResponse } from '../../dto/user.response'

import { UserWithPermissionResponse } from './dto/user-with-permission.response';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class GetMeController {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository
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
    const user = await this.userRepository.findOneByIdString(RequestContextService.getCurrentUserId());

    return {
      user: userMapper.map<User, UserResponse>(user, new UserResponse()),
    };
  }
}
