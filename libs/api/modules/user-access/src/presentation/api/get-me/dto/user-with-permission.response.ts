import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";

import { IUser } from "@owl-app/lib-contracts";

@ApiExtraModels()
export class UserMeResponse implements IUser{
  @ApiProperty({ type: () => String })
  id: string;

  @ApiProperty({ type: () => String })
  @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
  email: string;

  @ApiProperty({ type: () => String })
  @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
  firstName?: string;

  @ApiProperty({ type: () => String })
  @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
  lastName?: string;
}

export class UserWithPermissionResponse {

  @ApiProperty({ type: () => UserMeResponse })
  user: UserMeResponse;

}