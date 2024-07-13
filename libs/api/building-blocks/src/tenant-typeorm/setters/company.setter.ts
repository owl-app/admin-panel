import { EntityMetadata, SelectQueryBuilder } from "typeorm";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RequestContextService } from "../../context/app-request-context";

import { COMPANY_ENTITY } from "../../entity-tokens";
import { TenantSetter } from './tenant.setter';

@Injectable()
export class CompanySetter<Entity> implements TenantSetter<Entity>
{
  constructor(readonly configService: ConfigService) {

  }

  supports(metadata: EntityMetadata): boolean
  {
    return !!metadata
      .relations.find(r => r.type === COMPANY_ENTITY && r.propertyName === 'company');
  }

  execute(qb: SelectQueryBuilder<Entity>): void
  {
    qb
      .leftJoin(`${qb.alias}.companies`, 'company')
      .where('company.id IN (:ids)', { ids: RequestContextService.getCurrentUser().companies })
  }
}