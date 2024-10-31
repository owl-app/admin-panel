import { PartialType } from '@nestjs/swagger';

import { UserDto } from "../../../../dto/user.dto";

export class UpdateUserRequest extends PartialType(UserDto) {

}

