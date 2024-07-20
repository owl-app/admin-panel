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

import { InjectAssemblerQueryService, QueryService } from '@owl-app/crud-core'
import { Paginated } from '@owl-app/lib-api-bulding-blocks/pagination/pagination'
import type { DataProvider } from '@owl-app/lib-api-bulding-blocks/data-provider/data.provider'
import { PaginatedQuery } from '@owl-app/lib-api-bulding-blocks/pagination/paginated.query'
import { UUIDValidationPipe } from '@owl-app/lib-api-bulding-blocks/pipes/uuid-validation.pipe'
import { ApiErrorResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error.response'
import { InjectPaginatedQueryService } from '@owl-app/lib-api-bulding-blocks/data-provider/query/decorators/inject-paginated-query.decorator'

import { UserEntity } from '../../../../domain/entity/user.entity'
import { UserDto } from '../../../dto/user.dto'

import { CreateUserRequest, UpdateUserRequest, FilterUserDto, UserPaginatedResponse } from './dto'
import { createUserValidation } from './validation'
import { UserAssembler } from './user.assembler'

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
@Injectable()
export class UserCrudController {
  constructor(
    @InjectAssemblerQueryService(UserAssembler) readonly service: QueryService<UserEntity>,
    @InjectPaginatedQueryService(UserEntity) readonly paginatedService: DataProvider<Paginated<UserEntity>, FilterUserDto>
  ) {}

	@ApiOperation({ summary: 'Find user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found one user record',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    type: ApiErrorResponse
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @ApiOperation({ summary: 'Create new user' })
    @ApiCreatedResponse({
      description: 'The user has been successfully created.',
      type: UserDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  async create(@Body() createUserRequest: CreateUserRequest) {
    await createUserValidation.validateAsync(createUserRequest, { abortEarly: false });

    const createdUser = await this.service.createOne(createUserRequest);

    // const createdUser = await this.service.createWithRelations(createUserRequest, {
    //   company: [createUserRequest.companyId]
    // });

    // console.log(createdUser)

    return createdUser
  }

	@ApiOperation({ summary: 'Update user' })
    @ApiAcceptedResponse({
      description: 'User has been successfully updated.',
      type: UserDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found'
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
		@Body() updateUserRequest: UpdateUserRequest,
	): Promise<UserDto> {

    const updatedUser = await this.service.updateOne(id, updateUserRequest);

		return  updatedUser
	}

  @ApiOperation({ summary: 'Find all users by filters using pagination' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: UserPaginatedResponse,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  async paginated(
    @Query() filters: FilterUserDto,
    @Query() pagination: PaginatedQuery
  ): Promise<UserPaginatedResponse> {
    const paginated = await this.paginatedService.getData(filters, pagination);

    return new UserPaginatedResponse(paginated);
  }

  @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'User has been successfully deleted',
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
