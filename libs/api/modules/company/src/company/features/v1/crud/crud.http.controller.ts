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

import { InjectQueryService, QueryService } from '@owl-app/crud-core'
import { Paginated } from '@owl-app/lib-api-core/pagination/pagination'
import type { DataProvider } from '@owl-app/lib-api-core/data-provider/data.provider'
import { PaginatedQuery } from '@owl-app/lib-api-core/pagination/paginated.query'
import { UUIDValidationPipe } from '@owl-app/lib-api-core/pipes/uuid-validation.pipe'
import { ApiErrorResponse } from '@owl-app/lib-api-core/api/api-error.response'
import { InjectPaginatedQueryService } from '@owl-app/lib-api-core/data-provider/query/decorators/inject-paginated-query.decorator'

import { CompanyResponse } from '../../../dto/company.response'
import { CompanyEntity } from '../../../../domain/entity/company.entity'

import { CreateCompanyRequest, UpdateCompanyDto, FilterCompanyDto, CompanyPaginatedResponseDto } from './dto'
import { createCompanyValidation } from './validation'


@ApiTags('Company')
@Controller('companies')
@ApiBearerAuth()
@Injectable()
export class CompanyCrudController {
  constructor(
    @InjectQueryService(CompanyEntity)
    readonly service: QueryService<CompanyEntity>,
    @InjectPaginatedQueryService(CompanyEntity)
    readonly paginatedService: DataProvider<Paginated<CompanyEntity>, FilterCompanyDto, CompanyEntity>
  ) {}

	@ApiOperation({ summary: 'Find company by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found one company record',
    type: CompanyResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
    type: ApiErrorResponse
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CompanyResponse> {
    return this.service.getById(id, { relations: [{ name: 'users', query: {}}]});
  }

  @ApiOperation({ summary: 'Create new company' })
    @ApiCreatedResponse({
      description: 'The Company has been successfully created.',
      type: CompanyResponse,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  async create(@Body() createCompanyRequest: CreateCompanyRequest) {
    await createCompanyValidation.validateAsync(createCompanyRequest, { abortEarly: false });

    const createdCompany = await this.service.createOne(createCompanyRequest);

    return createdCompany;
  }

	@ApiOperation({ summary: 'Update Company' })
    @ApiAcceptedResponse({
      description: 'Company has been successfully updated.',
      type: CompanyResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Company not found'
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
		@Body() updateCompanyDto: UpdateCompanyDto,
	): Promise<CompanyResponse> {

    const updatedCompany = await this.service.updateOne(id, updateCompanyDto);

		return updatedCompany;
	}

  @ApiOperation({ summary: 'Find all companies by filters using pagination' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: CompanyPaginatedResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  async paginated(
    @Query() filters: FilterCompanyDto,
    @Query() pagination: PaginatedQuery
  ): Promise<CompanyPaginatedResponseDto> {
    const paginated = await this.paginatedService.getData(filters, pagination);

    return new CompanyPaginatedResponseDto(paginated);
  }

  @ApiOperation({ summary: 'Delete company' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Company has been successfully deleted',
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
