import { EntityMetadata, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RolesEnum, UserAware } from '@owl-app/lib-contracts';

import { RequestContextService } from '../../context/app-request-context';

import { USER_ENTITY } from '../../entity-tokens';
import { FilterQuery } from '../../registry/interfaces/filter-query';

@Injectable()
export class OwnerRelationFilter<Entity extends UserAware>
  implements FilterQuery<Entity>
{
  constructor(readonly configService: ConfigService) {}

  supports(metadata: EntityMetadata): boolean {
    return (
      !!metadata.relations.find(
        (r) => r.type === USER_ENTITY && r.propertyName === 'user'
      ) &&
      RequestContextService.getCurrentUser() &&
      RequestContextService.getCurrentUser().roles.includes(
        RolesEnum.ROLE_USER
      )
    );
  }

  execute(qb: SelectQueryBuilder<Entity>): void {
    if (!this.checkExistRelationAlias(qb, 'user')) {
      qb.leftJoin(`${qb.alias}.user`, 'user');
    }

    qb.andWhere('user.id = :userId', { userId: RequestContextService.getCurrentUser().id});
  }

  private checkExistRelationAlias(qb: SelectQueryBuilder<Entity>, relation: string) {
    return qb.expressionMap.aliases.find((alias) => alias.name && alias.name === relation);
  }
}
