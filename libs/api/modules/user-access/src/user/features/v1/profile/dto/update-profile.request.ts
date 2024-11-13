import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { ProfileDto } from "./profile.dto";

export class UpdateProfileRequest extends PartialType(ProfileDto) {

    @ApiPropertyOptional({ type: () => String })
    passwordNew?: string;

    @ApiPropertyOptional({ type: () => String })
    passwordNewRepeat?: string;
  
}
