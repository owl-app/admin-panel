import { ApiProperty } from "@nestjs/swagger"

import { IRoleResponse } from "@owl-app/lib-contracts";

import { BaseRbacItemResponse } from '../../common/dto/base/base-item.response.dto'
import { RoleSettingResponse } from "./role-setting.response.dto";

export class RoleResponse extends BaseRbacItemResponse implements IRoleResponse{

  constructor(
    name: string,
    description: string | null = null,
    ruleName: string | null = null,
    createdAt: string | null = null,
    updatedAt: string | null = null,
    setting: RoleSettingResponse | null = null,
  ) {
    super(name, description, ruleName, createdAt, updatedAt);
    this.setting = {
      displayName: setting?.displayName,
      theme: setting?.theme,
    };
  }
  
  @ApiProperty({ type: () => RoleSettingResponse })
  setting: RoleSettingResponse;

}