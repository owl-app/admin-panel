// eslint-disable-next-line max-classes-per-file
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

export class FilterSearchDto {
    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly type?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly value?: string;
}

export class FiltersDto {
    @ApiPropertyOptional({ type: () => FilterSearchDto })
    @IsOptional()
    readonly search?: string;
}

/**
 * Filter User DTO
 */
export class FilterUserDto {

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly email?: string;

    @ApiPropertyOptional({ type: () => FiltersDto })
    @IsOptional()
    readonly filters?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly firstName?: string;

    @ApiProperty({ type: () => String })
    @ApiPropertyOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly lastName?: string;
}
