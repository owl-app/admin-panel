import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { ICreatePermissionRequest } from "@owl-app/lib-contracts"

import { BaseRbacItemRequest } from "../../../../../common/dto/base/base-item.request.dto"

export class CreatePermissionRequest extends BaseRbacItemRequest implements ICreatePermissionRequest {

  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
  collection: string;

}
