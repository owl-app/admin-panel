import { IUpdatePermissionRequest } from "@owl-app/lib-contracts"

import { BaseRbacItemRequest } from "../../../../../common/dto/base/base-item.request.dto"

export class UpdatePermissionRequest extends BaseRbacItemRequest implements IUpdatePermissionRequest {}
