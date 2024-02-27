import { Permission } from "@owl-app/rbac-manager"

import { RbacItemMapper } from "../common/mapping"

import { PermissionResponse } from "./dto/permission.response.dto"

const mapper = new RbacItemMapper(Permission, PermissionResponse);

export default mapper;