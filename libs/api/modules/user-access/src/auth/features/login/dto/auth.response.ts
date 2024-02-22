import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from '../../../dto/user.response'

export class AuthResponse {

    @ApiProperty({ type: () => UserResponse })
    user: UserResponse;

    @ApiProperty({ type: () => String })
    accessToken: string;

    @ApiProperty({ type: () => String })
    refreshToken: string;
}