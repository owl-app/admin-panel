import { Injectable } from '@nestjs/common';
import { PaginatedRequest, AssemblerAsyncCrudService, Pagination } from '@owl-app/crud-nestjs';
import {
  InjectQueryService,
  QueryService
} from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils';

import { UserAssembler } from '../query/user.assembler';

import { User } from '../../domain/model/user';

import { CreateUserRequest, UserResponse } from '../../presentation/api/crud/dto';
import { FilterUserDto } from '../../presentation/api/crud/dto/filter-users.dto';


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

    return await this.paginated(
      {
        or: availableFilters,
      },
      pagination
    );
  }
}
