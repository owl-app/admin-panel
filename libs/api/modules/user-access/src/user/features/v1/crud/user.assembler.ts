import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

import { ClassTransformerAsyncAssembler } from '@owl-app/crud-nestjs'
import { APP_CONFIG_NAME, IConfigApp } from '@owl-app/lib-api-bulding-blocks/config'
import { Assembler, DeepPartial } from '@owl-app/crud-core'

import { UserEntity } from '../../../../domain/entity/user.entity'
import { UserResponse } from '../../../dto/user.response'
import mapper from '../../../mapping'

import { CreateUserRequest } from './dto'

@Assembler(UserResponse, UserEntity)
export class UserAssembler extends ClassTransformerAsyncAssembler<
  UserResponse,
  UserEntity,
  CreateUserRequest
> {
  @Inject(ConfigService)
  configService: ConfigService;

  async convertAsyncToCreateEntity(dto: CreateUserRequest): Promise<DeepPartial<UserEntity>> {
    const model = new UserEntity();
    const { password_bcrypt_salt_rounds } = this.configService.get<IConfigApp>(APP_CONFIG_NAME);

    model.passwordHash = await bcrypt.hash(dto.password, password_bcrypt_salt_rounds);
    model.firstName = dto.firstName;
    model.lastName = dto.lastName;
    model.email = dto.email;

    return model;
  }

  convertToDTO(user: UserEntity): UserResponse
  {
    console.log('user')
    console.log(user)
    return mapper.map<UserEntity, UserResponse>(user, new UserResponse());
  }
}
