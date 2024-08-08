import { Controller, Get, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '@owl-app/lib-contracts';
import { RequestContextService } from '@owl-app/lib-api-bulding-blocks/context/app-request-context';
import { InjectRepository } from '@owl-app/lib-api-bulding-blocks/typeorm/common/tenant-typeorm.decorators';

import { UserEntity } from '../../../domain/entity/user.entity'
import {type  IUserRepository } from '../../../database/repository/user-repository.interface';
import userMapper from '../../mapping'
import { UserResponseAuth } from '../../dto/user.response'

import { UserWithPermissionResponse } from './dto/user-with-permission.response';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class GetMeController {
  constructor(
    @InjectRepository(UserEntity)
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
      user: userMapper.map<User, UserResponseAuth>(user, new UserResponseAuth()),
    };
  }
}
