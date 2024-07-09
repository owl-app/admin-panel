import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IUser, IUserRequest } from "@owl-app/lib-contracts";

import { CreateUserRequest } from "@owl-app/lib-api-module-user-access/user/features/v1/crud/dto/create-user.request";

export class CreateCompanyRequest{

    @ApiProperty({ type: () => String })
    name: string;

    @ApiProperty({
        description: 'Array of Child Conversations.',
        type: [CreateUserRequest],
    })
    users: IUser[];

}
