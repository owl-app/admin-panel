import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { UserDto } from "../../../../dto/user.dto";

export class CreateUserRequest extends PartialType(UserDto) {

    @ApiPropertyOptional({ type: () => String })
    readonly companyId: string;

}
