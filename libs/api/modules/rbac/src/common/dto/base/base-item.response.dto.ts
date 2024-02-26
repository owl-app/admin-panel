import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

import type { IBaseRbacItemResponse } from '@owl-app/lib-contracts'
import { TypesItem } from "@owl-app/rbac-manager"



export abstract class BaseRbacItemResponse implements IBaseRbacItemResponse {

  @ApiPropertyOptional({ type: () => String })
  name: string;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  description: string | null = '';

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  ruleName: string | null = null;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  createdAt: string | null = null;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  updatedAt: string | null = null;
}
