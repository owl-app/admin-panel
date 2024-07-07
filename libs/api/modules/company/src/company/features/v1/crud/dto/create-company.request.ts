import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IUserRequest } from "@owl-app/lib-contracts";

export class CreateCompanyRequest{

    @ApiProperty({ type: () => String })
    name: string;

}
