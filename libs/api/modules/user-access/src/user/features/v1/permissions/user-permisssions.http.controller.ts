import { Controller, Get, HttpStatus, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AvalilableCollections, UserActions } from '@owl-app/lib-contracts';
import { RbacManager, Role } from '@owl-app/rbac-manager'
import { RequestContextService } from '@owl-app/lib-api-core/context/app-request-context';
import { RoutePermissions } from '@owl-app/lib-api-core/rbac/decorators/route-permission';
import { Permission } from '@owl-app/lib-api-core/rbac/types/permission';
import { UserPermissionResponse } from './dto/user-permission.response';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserPermissionsController {

  constructor(
    @Inject('RBAC_MANAGER') readonly rbacManager: RbacManager<Permission, Role>
  ) {}

  @ApiOperation({ description: 'permissions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all user permissions',
  })
  @Get('/permissions')
  @RoutePermissions(AvalilableCollections.USER, UserActions.PERMISSIONS)
  async getUserPermissions(): Promise<UserPermissionResponse> {
    const { routes, fields } = RequestContextService.getCurrentUser().permissions;

    return new UserPermissionResponse(routes, fields);
  }

}
