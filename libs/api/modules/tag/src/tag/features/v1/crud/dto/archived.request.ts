import { ApiProperty } from '@nestjs/swagger';

import { Archivable } from '@owl-app/lib-contracts';

export class ArchiveTagRequest implements Archivable {

  @ApiProperty({ required: false, default: false })
  archived?: boolean;

}
