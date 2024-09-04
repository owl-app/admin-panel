import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '@owl-app/lib-api-bulding-blocks/pagination/paginated.response'

import { TimeResponse } from '../../../../dto/time.response';

export class ClientPaginatedResponseDto extends PaginatedResponse<TimeResponse> {

  @ApiProperty({ type: TimeResponse, isArray: true })
  readonly items: readonly TimeResponse[];

}
