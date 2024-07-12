import { EntityMetadata, SelectQueryBuilder } from "typeorm";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TenantFilter } from './tenant-filter';

@Injectable()
export class CompanyFilter<Entity> implements TenantFilter<Entity>
{
  constructor(readonly configService: ConfigService) {

  }

  supports(metadata: EntityMetadata): boolean
  {
    return !!metadata
      .relations.find(r => r.type === 'CompanyEntity' && r.propertyName === 'companies');
  }

  execute(queryBuilder: SelectQueryBuilder<Entity>): void
  {
    console.log('execute')
  }
}