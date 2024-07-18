import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from '@owl-app/lib-api-bulding-blocks/pagination/paginated.response';

import { CompanyResponse } from '../../../../dto/company.response';

export class CompanyPaginatedResponseDto extends PaginatedResponse<CompanyResponse> {
  @ApiProperty({ type: CompanyResponse, isArray: true })
  readonly items: readonly CompanyResponse[];
}
