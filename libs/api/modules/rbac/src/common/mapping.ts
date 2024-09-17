import { Type } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import moment from 'moment';

import { Item } from '@owl-app/rbac-manager';

import { Mapper } from '@owl-app/lib-api-core/types/mapper.interface';

import { BaseAuthItemEntity } from '../domain/entity/base-auth.entity';

export class RbacItemMapper<
  Entity extends DeepPartial<BaseAuthItemEntity>,
  BaseItem extends Item,
  Response extends BaseAuthItemEntity
> implements Mapper<Entity, BaseItem, Response>
{
  constructor(private response: Type<Response>, private item: Type<BaseItem>) {}

  toPersistence(request: Entity): BaseItem {
    return new (this.item)(
      request.name,
      request.description,
      request.ruleName
    );
  }

  toResponse(item: Item): Response
  {
    const role = new (this.response);
    role.name = item.name;
    role.description = item.description;
    role.ruleName = item.ruleName;
    role.createdAt = moment(item.createdAt).toDate();
    role.updatedAt = moment(item.updatedAt).toDate(); 

    return role;
  }
}