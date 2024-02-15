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
  Inject,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'
import { UUIDValidationPipe } from '@owl-app/lib-api-bulding-blocks/infrastructure/pipes'
import { PaginatedRequest } from '@owl-app/crud-nestjs'
import { Manager } from '@owl-app/rbac-manager'

import { CreateUserRequest, UpdateUserDto, UserResponse, FilterUserDto, UserPaginatedResponseDto } from './dto'

import { UserService } from '../../../infrastructure/services/crud.service'

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
@Injectable()
export class UserCrudController {
  constructor(
    readonly service: UserService,
    // @Inject('RBAC_MANAGER') readonly rbacManager: Manager
  ) {}

	@ApiOperation({ summary: 'Find user by id' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found one user record',
      type: UserResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found'
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
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserRequest) {
    return await this.service.createAsyncOne(createUserDto);
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
		return await this.service.updateOne(id, updateUserDto);
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

    return new UserPaginatedResponseDto({
      ...paginated,
      items: paginated.items.map((user) => ({
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
      })),
    });
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

	@ApiOperation({ summary: 'Assign permission or roles to user' })
    @ApiAcceptedResponse({
      description: 'Role or permission has been successfully updated.'
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
	@Put('/assign-access/:id')
	async assignAccess(
		@Param('id', UUIDValidationPipe) userId: string,
    @Body() items: Array<string>
	): Promise<void> {
    const { id } = await this.service.getById(userId);

    // await Promise.all(items.map(async (item: string): Promise<void> => {
    //     await this.rbacManager.assign(item, id);
    // }));
  }
}
