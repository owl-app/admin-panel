import { ApiProperty } from "@nestjs/swagger";

import { User } from "@owl-app/lib-contracts";
import { UserRequest } from "./user.request";

export class CreateCompanyRequest{

    @ApiProperty({ type: () => String })
    name: string;

    @ApiProperty({
        description: 'Array of Child Conversations.',
        type: [UserRequest],
    })
    users: User[];

}
