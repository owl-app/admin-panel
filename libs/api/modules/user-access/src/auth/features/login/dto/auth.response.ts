import { ApiProperty } from "@nestjs/swagger";
import { UserResponseAuth } from '../../../dto/user.response'

export class AuthResponse {

    @ApiProperty({ type: () => UserResponseAuth })
    user: UserResponseAuth;

    @ApiProperty({ type: () => String })
    accessToken: string;

    @ApiProperty({ type: () => String })
    refreshToken: string;
}