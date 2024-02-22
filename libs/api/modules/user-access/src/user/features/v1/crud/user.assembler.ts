import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

import { ClassTransformerAsyncAssembler } from '@owl-app/crud-nestjs'
import { APP_CONFIG_NAME, IConfigApp } from '@owl-app/lib-api-bulding-blocks/config'
import { Assembler, DeepPartial } from '@owl-app/crud-core'

import { User } from '../../../../domain/model/user'
import { UserResponse } from '../../../dto/user.response'
import mapper from '../../../mapping'

import { CreateUserRequest } from './dto'

@Assembler(UserResponse, User)
export class UserAssembler extends ClassTransformerAsyncAssembler<
  UserResponse,
  User,
  CreateUserRequest
> {
  @Inject(ConfigService)
  configService: ConfigService;

  async convertAsyncToCreateEntity(dto: CreateUserRequest): Promise<DeepPartial<User>> {
    const model = new User();
    const { password_bcrypt_salt_rounds } = this.configService.get<IConfigApp>(APP_CONFIG_NAME);

    model.passwordHash = await bcrypt.hash(dto.password, password_bcrypt_salt_rounds);
    model.firstName = dto.firstName;
    model.lastName = dto.lastName;
    model.email = dto.email;

    return model;
  }

  convertToDTO(user: User): UserResponse
  {
    return mapper.map<User, UserResponse>(user, new UserResponse());
  }
}
