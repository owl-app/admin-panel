import { EntityMetadata, SelectQueryBuilder } from "typeorm";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CompanyAware, RolesEnum } from "@owl-app/lib-contracts";

import { RequestContextService } from "../../context/app-request-context";

import { COMPANY_ENTITY } from "../../entity-tokens";
import { FilterQuery } from "../../registry/interfaces/filter-query";

@Injectable()
export class CompanyRelationFilter<Entity extends CompanyAware> implements FilterQuery<Entity>
{
  constructor(readonly configService: ConfigService) {

  }

  supports(metadata: EntityMetadata): boolean
  {
    return !!metadata
      .relations.find(r => r.type === COMPANY_ENTITY && r.propertyName === 'company') &&
      RequestContextService.getCurrentUser().roles.includes(RolesEnum.ROLE_ADMIN_COMPANY);
  }

  execute(qb: SelectQueryBuilder<Entity>): void
  {
    qb
      .leftJoin(`${qb.alias}.company`, 'company')
      .andWhere('company.id = :id', { id: RequestContextService.getCurrentUser().company.id })
  }
}