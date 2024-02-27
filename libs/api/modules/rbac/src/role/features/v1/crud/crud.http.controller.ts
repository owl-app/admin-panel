import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Inject,
  Injectable,
  Put,
  HttpCode,
  Delete,
  Param
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'

import { Manager } from '@owl-app/rbac-manager'

import mapper from '../../../mapping'
import { RoleResponse } from '../../../dto/role.response.dto'
import { CreateRoleRequest } from '../../../dto/create-role.request.dto'
import { UpdateRoleRequest } from '../../../dto/update-role.request.dto'

@ApiTags('Rbac Role')
@Controller('rbac/roles')
@ApiBearerAuth()
@Injectable()
export class CrudController {
  constructor(@Inject('RBAC_MANAGER') readonly rbacManager: Manager) {}

	@ApiOperation({ summary: 'Create new role' })
    @ApiCreatedResponse({
      description: 'The role has been successfully created.',
      type: RoleResponse
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleRequest) {
    const addedRole = await this.rbacManager.addRole(
      mapper.toPersistence(createRoleDto)
    );

    return mapper.toResponse(addedRole);
  }

	@ApiOperation({ summary: 'Update role' })
    @ApiAcceptedResponse({
      description: 'Role has been successfully updated.',
      type: RoleResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Role not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
	@Put(':name')
  async updateRole(@Param('name') name: string, @Body() updateRoleDto: UpdateRoleRequest) {
    const updatedRole = await this.rbacManager.updateRole(
      name, mapper.toPersistence(updateRoleDto)
    );

    return mapper.toResponse(updatedRole);
  }

  @ApiOperation({ summary: 'Delete role' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Role has been successfully deleted',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Record not found',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':name')
  async remove(@Param('name') name: string): Promise<void> {
    await this.rbacManager.removeRole(name);
  }
}
