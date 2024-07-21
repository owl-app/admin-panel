import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrationRequest {
  @ApiProperty({ required: true, example: 'register@wp.pl'})
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({ required: true, example: 'test' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ required: true, example: '515-953-612' })
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;
}
