import { Type } from "@nestjs/common";
import moment from "moment";

import { Role } from "@owl-app/rbac-manager"

import { Mapper } from "@owl-app/lib-api-bulding-blocks/types/mapper.interface";

import { RoleResponse } from "./dto/role.response.dto"
import { RoleEntity } from "../domain/entity/role.entity";
import { CreateRoleRequest } from "./dto/create-role.request.dto";
import { UpdateRoleRequest } from "./dto/update-role.request.dto";

export class RoleItemMapper<
  Entity extends Role,
  Request extends CreateRoleRequest|UpdateRoleRequest,
  Response extends RoleResponse
> implements Mapper<Request, Entity|RoleEntity, Response>
{
  constructor(private entity: Type<Entity>, private response: Type<Response>) {}

  toPersistence(request: Request): Entity {
    return new (this.entity)(
      request.name,
      request.description,
      request.ruleName
    );
  }

  toResponse(entity: Partial<RoleEntity>): Response {
    return new (this.response)(
      entity.name,
      entity.description,
      entity.ruleName,
      entity.createdAt !== null ? moment(entity.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
      entity.updatedAt !== null ? moment(entity.updatedAt).format('YYYY-MM-DD HH:mm:ss') : null,
      entity.setting
    )
  }
}

const mapper = new RoleItemMapper(Role, RoleResponse);

export default mapper;