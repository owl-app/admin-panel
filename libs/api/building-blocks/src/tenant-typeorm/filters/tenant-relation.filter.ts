import { EntityMetadata, SelectQueryBuilder } from "typeorm";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RolesEnum, TenantAware } from "@owl-app/lib-contracts";

import { RequestContextService } from "../../context/app-request-context";

import { TENANT_ENTITY } from "../../entity-tokens";
import { FilterQuery } from "../../registry/interfaces/filter-query";

@Injectable()
export class TenantRelationFilter<Entity extends TenantAware> implements FilterQuery<Entity>
{
  constructor(readonly configService: ConfigService) {

  }

  supports(metadata: EntityMetadata): boolean
  {
    return !!metadata
      .relations.find(r => r.type === TENANT_ENTITY && r.propertyName === 'tenant') &&
      RequestContextService.getCurrentUser().roles.includes(RolesEnum.ROLE_ADMIN_COMPANY);
  }

  execute(qb: SelectQueryBuilder<Entity>): void
  {
    qb
      .leftJoin(`${qb.alias}.tenant`, 'tenant')
      .where('tenant.id = :id', { id: RequestContextService.getCurrentUser().tenant.id })
  }
}