import {
  Controller,
  HttpStatus,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  HttpCode,
  Injectable,
  ValidationPipe,
  Patch,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'

import { archiveValidationSchema, AvalilableCollections, CommonActions, CrudActions, TagActions, tagValidationSchema } from '@owl-app/lib-contracts'

import { AssemblerQueryService, InjectAssemblerQueryService } from '@owl-app/crud-core'
import { UUIDValidationPipe } from '@owl-app/lib-api-core/pipes/uuid-validation.pipe'
import { ApiErrorResponse } from '@owl-app/lib-api-core/api/api-error.response'
import type { DataProvider } from '@owl-app/lib-api-core/data-provider/data.provider'
import { InjectPaginatedQueryService } from '@owl-app/lib-api-core/data-provider/query/decorators/inject-paginated-query.decorator'
import { Paginated } from '@owl-app/lib-api-core/pagination/pagination'
import { RoutePermissions } from '@owl-app/lib-api-core/rbac/decorators/route-permission';
import { ValibotValidationPipe } from '@owl-app/lib-api-core/validation/valibot.pipe';

import { TagEntity } from '../../../../domain/entity/tag.entity'
import { TagResponse } from '../../../dto/tag.response'

import { CreateTagRequest, UpdateTagDto, FilterTagDto, TagPaginatedResponse } from './dto'
import { TagAssembler } from './tag.assembler'
import { TagPaginatedQuery } from './dto/tag-paginated.query'
import { ArchiveTagRequest } from './dto/archived.request'

@ApiTags('Tags')
@Controller('tags')
@ApiBearerAuth()
@Injectable()
export class TagCrudController {
  constructor(
    @InjectAssemblerQueryService(TagAssembler)
    readonly service: AssemblerQueryService<TagResponse, TagEntity>,
    @InjectPaginatedQueryService(TagEntity)
    readonly paginatedService: DataProvider<Paginated<TagEntity>, FilterTagDto, TagEntity>
  ) {}

@ApiOperation({ summary: 'Find tag by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found one tag record',
    type: TagResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tag not found',
    type: ApiErrorResponse
  })
  @Get(':id')
  @RoutePermissions(AvalilableCollections.TAG, CrudActions.READ)
  findOne(@Param('id') id: string): Promise<TagResponse> {
    return this.service.getById(id, { relations: [{ name: 'users', query: {}}]});
  }

  @ApiOperation({ summary: 'Create new tag' })
    @ApiCreatedResponse({
      description: 'The tag has been successfully created.',
      type: TagResponse,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  @RoutePermissions(AvalilableCollections.TAG, CrudActions.CREATE)
  async create(@Body(new ValibotValidationPipe(tagValidationSchema)) CreateTagRequest: CreateTagRequest) {
    const created = await this.service.createOne(CreateTagRequest);

    return created;
  }

  @ApiOperation({ summary: 'Update tag' })
    @ApiAcceptedResponse({
      description: 'Tag has been successfully updated.',
      type: TagResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Tag not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Put(':id')
  @RoutePermissions(AvalilableCollections.TAG, CrudActions.UPDATE)
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(new ValibotValidationPipe(tagValidationSchema)) UpdateTagDto: UpdateTagDto,
  ): Promise<TagResponse> {
    const updated = await this.service.updateOne(id, UpdateTagDto);

    return updated;
  }

  @ApiOperation({ summary: 'Delete tag' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Tag has been successfully deleted',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Record not found',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':id')
  @RoutePermissions(AvalilableCollections.TAG, CrudActions.DELETE)
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.deleteOne(id, { useSoftDelete: false, filter: { deletedAt: { isNot: null }}});
  }

  @ApiOperation({ summary: 'Find all tags by filters using pagination' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: TagPaginatedResponse,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  @RoutePermissions(AvalilableCollections.TAG, [CrudActions.LIST, TagActions.AVAILABLE])
  async paginated(
    @Query('filters') filters: FilterTagDto,
    @Query(new ValidationPipe({ transform: true })) pagination: TagPaginatedQuery,
  ): Promise<TagPaginatedResponse> {
    const paginated = await this.paginatedService.getData(filters, (pagination.pageable === 0 ? null : pagination));

    return new TagPaginatedResponse(paginated);
  }

  @ApiOperation({ summary: 'Archive tag' })
    @ApiAcceptedResponse({
      description: 'Tag has been successfully archived.',
      type: TagResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Tag not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Patch('archive/:id')
  @RoutePermissions(AvalilableCollections.TAG, CommonActions.ARCHIVE)
  async archive(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(new ValibotValidationPipe(archiveValidationSchema)) archiveClientRequest: ArchiveTagRequest,
  ): Promise<TagResponse> {
      let archived = null;

      if (archiveClientRequest.archived) {
        archived =  await this.service.deleteOne(id, { useSoftDelete: true})
      } else {
        archived = await this.service.restoreOne(id);
      }

      return archived;
  }
}
