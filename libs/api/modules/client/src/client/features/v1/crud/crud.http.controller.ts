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

import { PaginatedQuery } from '@owl-app/lib-api-bulding-blocks/pagination/paginated.query'
import { InjectQueryService, QueryService } from '@owl-app/crud-core'
import { UUIDValidationPipe } from '@owl-app/lib-api-bulding-blocks/pipes/uuid-validation.pipe'
import { ApiErrorResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error.response'
import type { DataProvider } from '@owl-app/lib-api-bulding-blocks/data-provider/data.provider'
import { InjectPaginatedQueryService } from '@owl-app/lib-api-bulding-blocks/data-provider/query/decorators/inject-paginated-query.decorator'
import { Paginated } from '@owl-app/lib-api-bulding-blocks/pagination/pagination'

import { ClientEntity } from '../../../../domain/entity/client.entity'
import { ClientResponse } from '../../../dto/client.response'

import { CreateClientRequest, UpdateClientDto, FilterClientDto, ClientPaginatedResponseDto } from './dto'
import { createClientValidation } from './validation'



@ApiTags('Client')
@Controller('clients')
@ApiBearerAuth()
@Injectable()
export class ClientCrudController {
  constructor(
    @InjectQueryService(ClientEntity) readonly service: QueryService<ClientEntity>,
    @InjectPaginatedQueryService(ClientEntity) readonly paginatedService: DataProvider<Paginated<ClientEntity>, FilterClientDto>
  ) {}

	@ApiOperation({ summary: 'Find client by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found one client record',
    type: ClientResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
    type: ApiErrorResponse
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ClientResponse> {
    return this.service.getById(id, { relations: [{ name: 'users', query: {}}]});
  }

  @ApiOperation({ summary: 'Create new client' })
    @ApiCreatedResponse({
      description: 'The Client has been successfully created.',
      type: ClientResponse,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  async create(@Body() createClientRequest: CreateClientRequest) {
    await createClientValidation.validateAsync(createClientRequest, { abortEarly: false });

    const createdClient = await this.service.createOne(createClientRequest);

    return createdClient;
  }

	@ApiOperation({ summary: 'Update Client' })
    @ApiAcceptedResponse({
      description: 'Client has been successfully updated.',
      type: ClientResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Client not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
	@Put(':id')
	async update(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() updateClientDto: UpdateClientDto,
	): Promise<ClientResponse> {

    const updatedClient = await this.service.updateOne(id, updateClientDto);

		return updatedClient;
	}

  @ApiOperation({ summary: 'Find all companies by filters using pagination' })
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
  async paginated(
    @Query('filters') filters: FilterClientDto,
    @Query() pagination: PaginatedQuery
  ): Promise<ClientPaginatedResponseDto> {
    const paginated = await this.paginatedService.getData(filters, pagination);

    return new ClientPaginatedResponseDto(paginated);
  }

  @ApiOperation({ summary: 'Delete client' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Client has been successfully deleted',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Record not found',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.deleteOne(id);
  }
}
