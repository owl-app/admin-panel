import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '@owl-app/crud-nestjs'

import { UserDto } from '../../../../dto/user.dto';

export class UserPaginatedResponse extends PaginatedResponse<UserDto> {
  @ApiProperty({ type: UserDto, isArray: true })
  readonly items: readonly UserDto[];
}
