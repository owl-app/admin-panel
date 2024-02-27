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
  Param,
  Get,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger';

import { Manager, Permission } from '@owl-app/rbac-manager';

import { RbacGuard } from '@owl-app/lib-api-bulding-blocks/rbac/rbac.guard'

import mapper from '../../../mapping'
import { CreatePermissionRequest } from '../../../dto/create-permission.request.dto'
import { PermissionResponse } from '../../../dto/permission.response.dto'
import { UpdatePermissionRequest } from '../../../dto/update-permission.request.dto'

@ApiTags('Rbac Permission')
@Controller('rbac/permissions')
@ApiBearerAuth()
@Injectable()
export class RbacPermissionCrudController {

  constructor(@Inject('RBAC_MANAGER') readonly rbacManager: Manager) {}

  @ApiOperation({ summary: 'All permissions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records.',
    type: PermissionResponse,
    isArray: true
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid input, The response body may contain clues as to what went wrong',
  })
  @UseGuards(RbacGuard)
  @Get()
  async getAll(): Promise<PermissionResponse[]> {
    const permissions = await this.rbacManager.getAllPermissions();
    
    return permissions.map((permission: Permission) => mapper.toResponse(permission));
  }

	@ApiOperation({ summary: 'Create new permission' })
  @ApiCreatedResponse({
    description: 'The permission has been successfully created.',
    type: PermissionResponse
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid input, The response body may contain clues as to what went wrong',
  })
  @Post()
  async createRole(@Body() createPermissionDto: CreatePermissionRequest) {
    const addedPermission = await this.rbacManager.addPermission(
      mapper.toPersistence(createPermissionDto),
    );

    return mapper.toResponse(addedPermission);
  }

	@ApiOperation({ summary: 'Update permission' })
  @ApiAcceptedResponse({
    description: 'Permission has been successfully updated.',
    type: PermissionResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid input, The response body may contain clues as to what went wrong'
  })
  // @HttpCode(HttpStatus.ACCEPTED)
  // @UseGuards(RbacGuard)
	@Put(':name')
  async updatePermission(@Param('name') name: string, @Body() updatePermissionDto: UpdatePermissionRequest) {
    const updatedPermission = await this.rbacManager.updatePermission(
      name, mapper.toPersistence(updatePermissionDto),
    );

    return mapper.toResponse(updatedPermission);
  }

  @ApiOperation({ summary: 'Delete permission' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Permission has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission not found',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':name')
  async remove(@Param('name') name: string): Promise<void> {
    await this.rbacManager.removePermission(name);
  }
}
