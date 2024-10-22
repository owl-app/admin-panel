import { ApiProperty } from "@nestjs/swagger";

import { Tag } from "@owl-app/lib-contracts";

export class WatchRequest {

    @ApiProperty({ type: () => String })
    description: string;

    @ApiProperty({ type: () => [String] })
    tags: Tag[]

}
