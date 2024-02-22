import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '@owl-app/crud-nestjs'

import { UserResponse } from '../../../../dto/user.response';

export class UserPaginatedResponseDto extends PaginatedResponse<UserResponse> {
  @ApiProperty({ type: UserResponse, isArray: true })
  readonly items: readonly UserResponse[];
}
