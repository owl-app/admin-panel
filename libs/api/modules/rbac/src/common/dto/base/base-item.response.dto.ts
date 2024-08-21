import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional } from "class-validator"
import { Exclude } from "class-transformer";

import type { IBaseRbacItemResponse } from '@owl-app/lib-contracts'

export abstract class BaseRbacItemResponse implements IBaseRbacItemResponse {

  @Exclude()
  type: string;

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
