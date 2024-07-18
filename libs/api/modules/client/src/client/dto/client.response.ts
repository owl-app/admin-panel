import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsOptional } from "class-validator";

import { User } from "@owl-app/lib-contracts";
import { RelationUserResponse } from "./relation-user.response";

// import { IUserResponse } from "@owl-app/lib-contracts";

export class ClientResponse {

    @ApiProperty({ type: () => String })
    id?: string;

    @ApiProperty({ type: () => String })
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    name?: string;

}