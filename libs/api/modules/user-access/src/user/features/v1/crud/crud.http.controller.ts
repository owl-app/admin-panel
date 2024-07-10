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
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PaginatedRequest } from '@owl-app/crud-nestjs'

import { UUIDValidationPipe } from '@owl-app/lib-api-bulding-blocks/pipes/uuid-validation.pipe'
import { ApiErrorResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error.response'

import{ UserEntity } from '../../../../domain/entity/user.entity'
import mapper from '../../../mapping'
import { UserResponse } from '../../../dto/user.response'

import { UserService } from './user.service'
import { CreateUserRequest, UpdateUserDto, FilterUserDto, UserPaginatedResponseDto } from './dto'
import { createUserValidation } from './validation'

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
@Injectable()
export class UserCrudController {
  constructor(
    readonly service: UserService
  ) {}

	@ApiOperation({ summary: 'Find user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found one user record',
    type: UserResponse,
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
      type: UserResponse,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  // @UsePipes(new ValidationPipe())
  async create(@Body() createUserRequest: CreateUserRequest) {
    await createUserValidation.validateAsync(createUserRequest, { abortEarly: false });

    const createdUser = await this.service.createAsyncOne(createUserRequest);

    return mapper.map<UserEntity, UserResponse>(createdUser, new UserResponse());
  }

	@ApiOperation({ summary: 'Update user' })
    @ApiAcceptedResponse({
      description: 'User has been successfully updated.',
      type: UserResponse,
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
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UserResponse> {

    const updatedUser = await this.service.updateOne(id, updateUserDto);

		return  mapper.map<UserEntity, UserResponse>(updatedUser, new UserResponse());
	}

  @ApiOperation({ summary: 'Find all users by filters using pagination' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: UserPaginatedResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  async paginated(
    @Query() filters: FilterUserDto,
    @Query() pagination: PaginatedRequest
  ): Promise<UserPaginatedResponseDto> {
    const paginated = await this.service.search(filters, pagination);

    return new UserPaginatedResponseDto(paginated);
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
