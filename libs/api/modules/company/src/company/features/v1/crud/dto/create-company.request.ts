import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyRequest{

    @ApiProperty({ type: () => String })
    name: string;

}
