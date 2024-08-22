import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Injectable,
  Put,
  HttpCode,
  Delete,
  Param,
  Get,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AssemblerQueryService, InjectAssemblerQueryService } from '@owl-app/crud-core';
import { Paginated } from '@owl-app/lib-api-bulding-blocks/pagination/pagination';
import type { DataProvider } from '@owl-app/lib-api-bulding-blocks/data-provider/data.provider'
import { InjectPaginatedQueryService } from '@owl-app/lib-api-bulding-blocks/data-provider/query/decorators/inject-paginated-query.decorator';
import { PaginatedQuery } from '@owl-app/lib-api-bulding-blocks/pagination/paginated.query';

import { PermissionEntity } from '../../../../domain/entity/permission.entity';

import { CreatePermissionRequest } from './dto/create-permission.request.dto'
import { PermissionResponse } from './dto/permission.response.dto'
import { UpdatePermissionRequest } from './dto/update-permission.request.dto'
import { PermissionAssembler } from './permission.assembler';
import { FilterPermissionDto, PermissionPaginatedResponseDto } from './dto';

@ApiTags('Rbac Permission')
@Controller('rbac/permissions')
@ApiBearerAuth()
@Injectable()
export class RbacPermissionCrudController {

  constructor(
    @InjectAssemblerQueryService(PermissionAssembler) readonly service: AssemblerQueryService<PermissionResponse, PermissionEntity>,
    @InjectPaginatedQueryService(PermissionEntity) readonly paginatedService: DataProvider<Paginated<PermissionResponse>, FilterPermissionDto>
  ) {}

  @ApiOperation({ summary: 'Find permission by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found one permission record',
    type: PermissionResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission not found',
    type: PermissionResponse
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PermissionResponse> {
    const permission = await this.service.getById(id);

    return permission;
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
    const addedPermission = await this.service.createOne(createPermissionDto);

    return addedPermission;
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
    const updatedPermission = await this.service.updateOne(name, updatePermissionDto);

    return updatedPermission;
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
    await this.service.deleteOne(name);
  }

  @ApiOperation({ summary: 'Find all permissions by filters using pagination' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: PermissionPaginatedResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  async paginated(
    @Query('filters') filters: FilterPermissionDto,
    @Query() pagination: PaginatedQuery
  ): Promise<PermissionPaginatedResponseDto> {
    const paginated = await this.paginatedService.getData(filters, pagination);

    return new PermissionPaginatedResponseDto(paginated);
  }
}
