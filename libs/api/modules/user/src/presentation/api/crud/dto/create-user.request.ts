import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail } from 'class-validator';
import { IUserRequest } from "@owl-app/lib-contracts";

/**
 * Create User DTO validation
 */
export class CreateUserRequest implements IUserRequest{

    @ApiProperty({ type: () => String })
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    @IsEmail()
    email: string;

    @ApiProperty({ type: () => String })
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    password?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly firstName?: string;

    @ApiPropertyOptional({ type: () => String })
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly lastName?: string;

    @ApiPropertyOptional({ type: () => String })
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    readonly phoneNumber?: string;
}
