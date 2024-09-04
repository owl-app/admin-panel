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
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'

import { AvalilableCollections, CrudActions, timeValidationSchema } from '@owl-app/lib-contracts'

import { PaginatedQuery } from '@owl-app/lib-api-bulding-blocks/pagination/paginated.query'
import { AssemblerQueryService, InjectAssemblerQueryService } from '@owl-app/crud-core'
import { UUIDValidationPipe } from '@owl-app/lib-api-bulding-blocks/pipes/uuid-validation.pipe'
import { ApiErrorResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error.response'
import type { DataProvider } from '@owl-app/lib-api-bulding-blocks/data-provider/data.provider'
import { InjectPaginatedQueryService } from '@owl-app/lib-api-bulding-blocks/data-provider/query/decorators/inject-paginated-query.decorator'
import { Paginated } from '@owl-app/lib-api-bulding-blocks/pagination/pagination'
import { RoutePermissions } from '@owl-app/lib-api-bulding-blocks/rbac/decorators/route-permission';
import { ValibotValidationPipe } from '@owl-app/lib-api-bulding-blocks/validation/valibot.pipe';

import { TimeEntity } from '../../../../domain/entity/time.entity'
import { TimeResponse } from '../../../dto/time.response'

import { CreateClientRequest, UpdateClientDto, FilterClientDto, ClientPaginatedResponseDto } from './dto'
import { TimeAssembler } from './time.assembler'

@ApiTags('Time Tracker Manage')
@Controller('times')
@ApiBearerAuth()
@Injectable()
export class TimeCrudController {
  constructor(
    @InjectAssemblerQueryService(TimeAssembler) readonly service: AssemblerQueryService<TimeResponse, TimeEntity>,
    @InjectPaginatedQueryService(TimeEntity) readonly paginatedService: DataProvider<Paginated<TimeEntity>, FilterClientDto>
  ) {}

@ApiOperation({ summary: 'Find time by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found one time record',
    type: TimeResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Time not found',
    type: ApiErrorResponse
  })
  @Get(':id')
  @RoutePermissions(AvalilableCollections.CLIENT, CrudActions.READ)
  findOne(@Param('id') id: string): Promise<TimeResponse> {
    return this.service.getById(id, { relations: [{ name: 'users', query: {}}]});
  }

  @ApiOperation({ summary: 'Create new time' })
    @ApiCreatedResponse({
      description: 'The time has been successfully created.',
      type: TimeResponse,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  @RoutePermissions(AvalilableCollections.CLIENT, CrudActions.CREATE)
  async create(@Body(new ValibotValidationPipe(timeValidationSchema)) createClientRequest: CreateClientRequest) {
    const createdClient = await this.service.createOne(createClientRequest);

    return createdClient;
  }

  @ApiOperation({ summary: 'Update time' })
    @ApiAcceptedResponse({
      description: 'Time has been successfully updated.',
      type: TimeResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Time not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Put(':id')
  @RoutePermissions(AvalilableCollections.CLIENT, CrudActions.UPDATE)
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(new ValibotValidationPipe(timeValidationSchema)) updateClientDto: UpdateClientDto,
  ): Promise<TimeResponse> {
    const updatedClient = await this.service.updateOne(id, updateClientDto);

    return updatedClient;
  }

  @ApiOperation({ summary: 'Delete time' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Time has been successfully deleted',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Record not found',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':id')
  @RoutePermissions(AvalilableCollections.CLIENT, CrudActions.DELETE)
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.deleteOne(id);
  }

  @ApiOperation({ summary: 'Find all times by filters using pagination' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: ClientPaginatedResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  @RoutePermissions(AvalilableCollections.CLIENT, CrudActions.LIST)
  async paginated(
    @Query('filters') filters: FilterClientDto,
    @Query() pagination: PaginatedQuery
  ): Promise<ClientPaginatedResponseDto> {
    const paginated = await this.paginatedService.getData(filters, pagination);

    return new ClientPaginatedResponseDto(paginated);
  }
}
