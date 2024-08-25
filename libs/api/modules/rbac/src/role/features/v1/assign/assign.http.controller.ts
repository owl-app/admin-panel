import {
  Controller,
  HttpStatus,
  Body,
  Inject,
  Injectable,
  Put,
  HttpCode,
  Param
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'

import { AvalilableCollections, RoleActions } from '@owl-app/lib-contracts';
import { RoutePermissions } from '@owl-app/lib-api-bulding-blocks/rbac/decorators/route-permission';
import { Manager } from '@owl-app/rbac-manager';

@ApiTags('Rbac Role')
@Controller('rbac/roles')
@ApiBearerAuth()
@Injectable()
export class AssignController {
  constructor(@Inject('RBAC_MANAGER') readonly rbacManager: Manager) {}

	@ApiOperation({ summary: 'Assign to role permissions or other roles' })
    @ApiAcceptedResponse({
      description: 'Assign has been successfully invoked.',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Put('/assign/:name')
  @RoutePermissions(AvalilableCollections.ROLE, RoleActions.ASSIGN)
  async assign(@Param('name') name: string, @Body() items: Array<string>): Promise<void> {
    items.map(async (item: string): Promise<void> => {
      this.rbacManager.addChild(name, item);
    });
  }
}
