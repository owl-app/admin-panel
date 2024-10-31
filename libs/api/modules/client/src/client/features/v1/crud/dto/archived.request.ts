import { ApiProperty } from '@nestjs/swagger';

import { Archivable } from '@owl-app/lib-contracts';

export class ArchiveClientRequest implements Archivable {

  @ApiProperty({ required: false, default: false })
  archived?: boolean;

}
