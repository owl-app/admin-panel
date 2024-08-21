import { Type } from "@nestjs/common";
import moment from "moment";

import { Role } from "@owl-app/rbac-manager"
import { DeepPartial } from "@owl-app/crud-core";
import { Mapper } from "@owl-app/lib-api-bulding-blocks/types/mapper.interface";

import { RoleEntity } from "../domain/entity/role.entity";

export class RoleItemMapper<
  Entity extends DeepPartial<RoleEntity>,
  Item extends Role,
  Response extends RoleEntity
> implements Mapper<Entity, Item, Response>
{
  constructor(private response: Type<Response>, private item: Type<Item>) {}

  toPersistence(request: Entity): Item {
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

const mapper = new RoleItemMapper(RoleEntity, Role);

export default mapper;

