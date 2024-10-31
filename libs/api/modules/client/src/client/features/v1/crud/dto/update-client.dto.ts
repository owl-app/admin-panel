import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Archivable } from '@owl-app/lib-contracts';

import { CreateClientRequest } from './create-client.request';

export class UpdateClientDto extends PartialType(CreateClientRequest) implements Archivable {

  @ApiProperty({ required: false, default: false })
  archived?: boolean;

}
