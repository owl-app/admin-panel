import { ApiProperty } from "@nestjs/swagger";

export class CreateTimeRequest{

    @ApiProperty({ type: () => String })
    description: string;

    @ApiProperty({ type: () => String })
    timeIntervalStart: string;

    @ApiProperty({ type: () => String })
    timeIntervalEnd: string;
}
