import {
  Controller,
  HttpStatus,
  Inject,
  Injectable,
  Param,
  Get,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

import { Manager } from '@owl-app/rbac-manager'

@ApiTags('Rbac Role')
@Controller('rbac/roles')
@ApiBearerAuth()
@Injectable()
export class AssignedPermissionsController {
  constructor(@Inject('RBAC_MANAGER') readonly rbacManager: Manager) {}

  @ApiOperation({ summary: 'Find all assigned permissions to role' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: String,
      isArray: true,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get('assigned-permissions/:name')
  async assignedPermissions(@Param('name') name: string): Promise<string[]> {
    const permissions = await this.rbacManager.getPermissionsByRoleName(name);

    return Object.keys(permissions);
  }
}
