import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional } from "class-validator";

// import { IUserResponse } from "@owl-app/lib-contracts";

export class CompanyResponse {

    @ApiProperty({ type: () => String })
    id: string;

    @ApiProperty({ type: () => String })
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    name: string;

    @ApiPropertyOptional({ type: () => String })
    firstName?: string;
  
    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    lastName?: string;

}