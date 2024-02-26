import { ICreatePermissionRequest } from "@owl-app/lib-contracts"

import { BaseRbacItemRequest } from "../../../dto/base/base-item.request.dto"

/**
 * Create Permission DTO validation
 */
export class CreatePermissionRequest extends BaseRbacItemRequest implements ICreatePermissionRequest {

}
