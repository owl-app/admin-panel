import { Injectable } from '@nestjs/common'

import { PaginatedRequest, AssemblerAsyncCrudService, Pagination, TypeOrmQueryService } from '@owl-app/crud-nestjs'
import { InjectQueryService, QueryService } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils'

import { UserEntity } from '../../../../domain/entity/user.entity'
import { UserResponse } from '../../../dto/user.response'
import mapper from '../../../mapping'

import { UserAssembler } from './user.assembler'
import { CreateUserRequest, FilterUserDto } from './dto'

@Injectable()
export class UserService extends AssemblerAsyncCrudService(
  UserEntity,
  UserResponse,
  CreateUserRequest
) {
  constructor(
    readonly assembler: UserAssembler,
    @InjectQueryService(UserEntity) public readonly queryService: QueryService<UserEntity> & TypeOrmQueryService<UserEntity>
  ) {
    super(assembler, queryService);
  }

  async search(
    filters: FilterUserDto,
    pagination: PaginatedRequest
  ): Promise<Pagination<UserResponse>> {
    const availableFilters = [];

    if (!isEmpty(filters.email)) {
      availableFilters.push({
        email: { like: `%${filters.email}%` },
      });
    }

    if (!isEmpty(filters.firstName)) {
      availableFilters.push({
        firstName: { like: `%${filters.firstName}%` },
      });
    }

    if (!isEmpty(filters.lastName)) {
      availableFilters.push({
        lastName: { like: `%${filters.lastName}%` },
      });
    }

    const result = await this.paginated(
      {
        or: availableFilters,
      },
      pagination
    );

    return {
        ...result,
        items: result.items.map((user) => mapper.map<UserEntity, UserResponse>(user, new UserResponse()))
    }
  }
}
