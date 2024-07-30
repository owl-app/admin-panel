import { DeepPartial, EntityMetadata } from "typeorm";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CompanyAware, RolesEnum } from "@owl-app/lib-contracts";

import { RequestContextService } from "../../context/app-request-context";

import { COMPANY_ENTITY } from "../../entity-tokens";
import { EntitySetter } from "../../registry/interfaces/entity-setter";

@Injectable()
export class CompanySetter<Entity extends CompanyAware> implements EntitySetter<Entity>
{
  constructor(readonly configService: ConfigService) {

  }

  supports(metadata: EntityMetadata): boolean
  {
    return !!metadata
      .relations.find(r => r.type === COMPANY_ENTITY && r.propertyName === 'company') && 
      RequestContextService.getCurrentUser()?.roles.includes(RolesEnum.ROLE_ADMIN_COMPANY);
  }

  execute<T extends DeepPartial<Entity>>(entityOrEntities: T | T[],): void
  {
    if(Array.isArray(entityOrEntities))
    {
      entityOrEntities.forEach(entity => {
        entity.company = RequestContextService.getCurrentUser().company;
      });
    } else {
      entityOrEntities.company = RequestContextService.getCurrentUser().company;
    }
  }
}