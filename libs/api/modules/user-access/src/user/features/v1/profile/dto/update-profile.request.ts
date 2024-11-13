import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { ProfileDto } from "./profile.dto";

export class UpdateProfileRequest extends PartialType(ProfileDto) {

    @ApiPropertyOptional({ type: () => String })
    password_new?: string;

    @ApiPropertyOptional({ type: () => String })
    password_new_repeat?: string;
  
}
