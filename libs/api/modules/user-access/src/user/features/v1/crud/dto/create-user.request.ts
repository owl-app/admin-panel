import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { UserDto } from "../../../../dto/user.dto";

export class CreateUserRequest {

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

}
