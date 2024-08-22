import { Permission } from "@owl-app/rbac-manager"

import { RbacItemMapper } from "../common/mapping"

import { PermissionEntity } from "../domain/entity/permission.entity";

const mapper = new RbacItemMapper(PermissionEntity, Permission);

export default mapper;