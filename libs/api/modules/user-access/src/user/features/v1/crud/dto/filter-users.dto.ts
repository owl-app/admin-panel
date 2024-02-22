import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

/**
 * Filter User DTO
 */
export class FilterUserDto {

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly email?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly firstName?: string;

    @ApiProperty({ type: () => String })
    @ApiPropertyOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly lastName?: string;
}
