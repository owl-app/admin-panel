import { PartialType } from '@nestjs/swagger';
import { CreateUserRequest } from './create-user.request';

export class UpdateUserDto extends PartialType(CreateUserRequest) {}
