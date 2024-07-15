import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '@owl-app/crud-nestjs'

import { ClientResponse } from '../../../../dto/client.response';

export class ClientPaginatedResponseDto extends PaginatedResponse<ClientResponse> {
  @ApiProperty({ type: ClientResponse, isArray: true })
  readonly items: readonly ClientResponse[];
}
