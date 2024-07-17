import { Injectable } from '@nestjs/common'

import { PaginatedRequest, AssemblerAsyncCrudService, Pagination, TypeOrmQueryService } from '@owl-app/crud-nestjs'
import { AssemblerQueryService, InjectQueryService, QueryService } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils'

import { UserEntity } from '../../../../domain/entity/user.entity'
import { UserDto } from '../../../dto/user.dto'

import { UserAssembler } from './user.assembler'
import { FilterUserDto } from './dto'

@Injectable()
export class UserService extends AssemblerQueryService<UserDto, UserEntity> {
  constructor(
    readonly assembler: UserAssembler,
    @InjectQueryService(UserEntity) public readonly queryService: QueryService<UserEntity> & TypeOrmQueryService<UserEntity>
  ) {
    super(assembler, queryService);
  }

  async search(
    filters: FilterUserDto,
    pagination: PaginatedRequest
  ): Promise<Pagination<UserDto>> {
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

    // const result = await this.paginated(
    //   {
    //     or: availableFilters,
    //   },
    //   pagination
    // );

    return {
        metadata: {
          total: 0
        },
        items: []
        // items: result.items.map((user) => mapper.map<UserEntity, UserDto>(user, new UserDto()))
    }
  }
}
