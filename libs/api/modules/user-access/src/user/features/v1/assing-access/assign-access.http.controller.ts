import {
  Controller,
  HttpStatus,
	Put,
  Body,
  Param,
  HttpCode,
  Injectable,
  Inject
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Manager } from '@owl-app/rbac-manager'

import { UUIDValidationPipe } from '@owl-app/lib-api-bulding-blocks/pipes/uuid-validation.pipe'
import { InjectRepository } from '@owl-app/lib-api-bulding-blocks/typeorm/common/tenant-typeorm.decorators'

import type { IUserRepository } from '../../../../database/repository/user-repository.interface'
import { UserEntity } from '../../../../domain/entity/user.entity'

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
@Injectable()
export class AssignAccessController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: IUserRepository,
    @Inject('RBAC_MANAGER') readonly rbacManager: Manager
  ) {}

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
    const { id } = await this.userRepository.findOneByIdString(userId);

    await Promise.all(items.map(async (item: string): Promise<void> => {
        await this.rbacManager.assign(item, id);
    }));
  }
}
