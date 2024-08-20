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
  Query
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'

import { Manager } from '@owl-app/rbac-manager'

import { PaginatedQuery } from '@owl-app/lib-api-bulding-blocks/pagination/paginated.query'
import type { DataProvider } from '@owl-app/lib-api-bulding-blocks/data-provider/data.provider'
import { InjectPaginatedQueryService } from '@owl-app/lib-api-bulding-blocks/data-provider/query/decorators/inject-paginated-query.decorator'
import { Paginated } from '@owl-app/lib-api-bulding-blocks/pagination/pagination'

import mapper from '../../../mapping'
import { RoleResponse } from '../../../dto/role.response.dto'
import { CreateRoleRequest } from '../../../dto/create-role.request.dto'
import { UpdateRoleRequest } from '../../../dto/update-role.request.dto'
import { RoleEntity } from '../../../../domain/entity/role.entity'

import { FilterRoleDto } from './dto';
import { RolePaginatedResponseDto } from './dto/role.paginated.response.dto'
import { RoleService } from './role.service'

@ApiTags('Rbac Role')
@Controller('rbac/roles')
@ApiBearerAuth()
@Injectable()
export class CrudController {
  constructor(
    readonly roleService: RoleService,
    @Inject('RBAC_MANAGER') readonly rbacManager: Manager,
    @InjectPaginatedQueryService(RoleEntity) readonly paginatedService: DataProvider<Paginated<RoleResponse>, FilterRoleDto>
  ) {}

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
    const addedRole = await this.roleService.createWithSetting(createRoleDto);

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
    const updatedRole = await this.roleService.updateWithSetting(name, updateRoleDto);

    return mapper.toResponse(updatedRole);
  }

  @ApiOperation({ summary: 'Find all roles by filters using pagination' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: RolePaginatedResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  async paginated(
    @Query('filters') filters: FilterRoleDto,
    @Query() pagination: PaginatedQuery
  ): Promise<RolePaginatedResponseDto> {
    const paginated = await this.paginatedService.getData(filters, pagination);

    return new RolePaginatedResponseDto(paginated);
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
