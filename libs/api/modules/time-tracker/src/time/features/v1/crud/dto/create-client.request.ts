import { ApiProperty } from "@nestjs/swagger";

export class CreateClientRequest{

    @ApiProperty({ type: () => String })
    description: string;

    @ApiProperty({ type: () => Date })
    timeIntervalStart: Date;

    @ApiProperty({ type: () => Date })
    timeIntervalEnd: Date;
}
