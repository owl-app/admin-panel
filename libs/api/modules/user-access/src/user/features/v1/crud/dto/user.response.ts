import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional } from "class-validator";

import { IUserResponse } from "@owl-app/lib-contracts";

export class UserResponse implements IUserResponse {

    @ApiProperty({ type: () => String })
    id: string;

    @ApiProperty({ type: () => String })
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    email: string;

    @ApiPropertyOptional({ type: () => String })
    firstName?: string;
  
    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    lastName?: string;

}
  