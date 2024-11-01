import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ArchiveOptions } from '@owl-app/lib-contracts';

import { FilterCustom } from '../../filtering/filter-custom';
import { SelectQueryBuilder } from 'typeorm';

export interface FilterArchivedQuery {
  archived?: ArchiveOptions;
}

export class FilterArchivedApiProperty implements FilterArchivedQuery {

  @ApiProperty({ enum: ArchiveOptions})
  @IsOptional()
  archived?: ArchiveOptions;

}

export class ArchivedFilter<Entity>
  implements FilterCustom<SelectQueryBuilder<Entity>>
{
  apply<QueryData extends FilterArchivedQuery>(
    data: QueryData,
    qb: SelectQueryBuilder<Entity>
  ): void {
    if (!qb.expressionMap.withDeleted) return;

    switch (data?.archived) {
      case ArchiveOptions.ARCHIVED:
        qb.andWhere(`${qb.alias}.deleted_at is not null`);
        break;
      case ArchiveOptions.ACTIVE:
        qb.andWhere(`${qb.alias}.deleted_at is null`);
        break;
      default:
        qb.andWhere(`(${qb.alias}.deleted_at is not null OR ${qb.alias}.deleted_at is null)`);
        break;
    }
  }
}
