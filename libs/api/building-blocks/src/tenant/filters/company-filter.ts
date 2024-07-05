import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TenantFilter } from './tenant-filter';

@Injectable()
export class CompanyFilter implements TenantFilter
{
  constructor(readonly configService: ConfigService) {

  }

  execute(queryBuilder: SelectQueryBuilder<ObjectLiteral>): void
  {
    console.log(this.configService)
  }
}