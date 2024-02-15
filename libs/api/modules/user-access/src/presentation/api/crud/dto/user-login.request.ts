import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { IUserLoginRequest } from "@owl-app/lib-contracts";

export class UserLoginRequest implements IUserLoginRequest {

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @IsEmail()
  @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
  readonly email: string;

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  readonly password: string;
}