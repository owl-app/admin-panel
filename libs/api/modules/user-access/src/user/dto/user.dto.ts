import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

import type { Company, IUserRequest } from "@owl-app/lib-contracts";

export class UserDto implements IUserRequest{

    @ApiProperty({ type: () => String, example: 'test@fajny.pl'})
    email?: string;

    @ApiProperty({ type: () => String })
    password?: string;

    @ApiPropertyOptional({ type: () => String })
    readonly firstName?: string;

    @ApiPropertyOptional({ type: () => String })
    readonly lastName?: string;

    @ApiPropertyOptional({ type: () => String })
    readonly phoneNumber?: string;

    @ApiProperty({ type: () => String })
    id: string;

    @ApiPropertyOptional({ type: () => Array })
    @IsOptional()
    company: Company;
}
