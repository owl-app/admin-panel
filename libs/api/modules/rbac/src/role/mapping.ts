import { Role } from "@owl-app/rbac-manager"

import { RbacItemMapper } from "../common/mapping"

import { RoleResponse } from "./dto/role.response.dto"

const mapper = new RbacItemMapper(Role, RoleResponse);

export default mapper;