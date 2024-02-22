import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

import { IUserResponse } from "@owl-app/lib-contracts";

export class UserResponse implements IUserResponse {

    @ApiProperty({ type: () => String })
    email: string;

    @ApiPropertyOptional({ type: () => String })
    firstName?: string;
  
    @ApiPropertyOptional({ type: () => String })
    lastName?: string;

}