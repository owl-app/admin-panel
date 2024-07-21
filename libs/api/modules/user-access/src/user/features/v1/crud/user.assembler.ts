import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

import { APP_CONFIG_NAME, IConfigApp } from '@owl-app/lib-api-bulding-blocks/config'
import { Assembler, ClassTransformerAssembler, DeepPartial } from '@owl-app/crud-core'

import { UserEntity } from '../../../../domain/entity/user.entity'
import { UserDto } from '../../../dto/user.dto'
import mapper from '../../../mapping'

import { CreateUserRequest } from './dto'

@Assembler(UserDto, UserEntity)
export class UserAssembler extends ClassTransformerAssembler<
  UserDto,
  UserEntity
> {
  @Inject(ConfigService)
  configService: ConfigService;

  async convertToCreateEntity(dto: CreateUserRequest): Promise<DeepPartial<UserEntity>> {
    const model = new UserEntity();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { password_bcrypt_salt_rounds } = this.configService.get<IConfigApp>(APP_CONFIG_NAME);

    model.passwordHash = await bcrypt.hash(dto.password, password_bcrypt_salt_rounds);
    model.firstName = dto.firstName;
    model.lastName = dto.lastName;
    model.email = dto.email;
    model.phoneNumber = dto.phoneNumber;

    return model;
  }

  async convertAsyncToDTO(user: Promise<UserEntity>): Promise<UserDto>
  {
    const createdUser = await user;
    return mapper.map<UserEntity, UserDto>(createdUser, new UserDto());
  }
}
