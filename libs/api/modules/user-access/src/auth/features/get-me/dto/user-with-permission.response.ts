import { ApiProperty } from "@nestjs/swagger";

import { UserResponse } from '../../../dto/user.response'

export class UserWithPermissionResponse {

  @ApiProperty({ type: () => UserResponse })
  user: UserResponse;

}