import { Injectable } from '@nestjs/common'

import { PaginatedRequest, AssemblerAsyncCrudService, Pagination } from '@owl-app/crud-nestjs'
import { InjectQueryService, QueryService } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils'

import { User } from '../../../../domain/model/user'
import { UserResponse } from '../../../dto/user.response'
import mapper from '../../../mapping'

import { UserAssembler } from './user.assembler'
import { CreateUserRequest, FilterUserDto } from './dto'

@Injectable()
export class UserService extends AssemblerAsyncCrudService(
  User,
  UserResponse,
  CreateUserRequest
) {
  constructor(
    readonly assembler: UserAssembler,
    @InjectQueryService(User) readonly service: QueryService<User>
  ) {
    super(assembler, service);
  }

  async search(
    filters: FilterUserDto,
    pagination: PaginatedRequest
  ): Promise<Pagination<UserResponse>> {
    const availableFilters = [];

    if (!isEmpty(filters.email)) {
      availableFilters.push({
        email: { like: '%' + filters.email + '%' },
      });
    }

    if (!isEmpty(filters.firstName)) {
      availableFilters.push({
        firstName: { like: '%' + filters.firstName + '%' },
      });
    }

    if (!isEmpty(filters.lastName)) {
      availableFilters.push({
        lastName: { like: '%' + filters.lastName + '%' },
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
        items: result.items.map((user) => mapper.map<User, UserResponse>(user, new UserResponse()))
    }
  }
}
