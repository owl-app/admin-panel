import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorValidationItem {

  @ApiProperty({ example: 'Invalid email' })
  readonly message: string;

  @ApiProperty({ example: ['email'], type: [String, Number] })
  readonly path: (string | number)[]

}

export class ApiErrorValidationResponse {

  @ApiProperty({ type: () => [ApiErrorValidationItem] })
  errors: ApiErrorValidationItem[]

  constructor(errors: ApiErrorValidationItem[]) {
    this.errors = errors;
  }

}
