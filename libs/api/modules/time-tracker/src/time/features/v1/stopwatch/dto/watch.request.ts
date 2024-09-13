import { ApiProperty } from "@nestjs/swagger";

export class WatchRequest {

    @ApiProperty({ type: () => String })
    description: string;

}
