import { ApiProperty } from "@nestjs/swagger";

import { IPermissionResponse } from "@owl-app/lib-contracts";

import { BaseRbacItemResponse } from "../../../../../common/dto/base/base-item.response.dto"

export class PermissionResponse extends BaseRbacItemResponse implements IPermissionResponse {

  @ApiProperty({ type: () => String })
  refer: string | null = '';

  @ApiProperty({ type: () => String })
  collection: string | null = '';

}