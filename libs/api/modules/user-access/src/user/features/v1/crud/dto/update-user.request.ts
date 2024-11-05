import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';
import type { Role } from '@owl-app/lib-contracts';

export class UpdateUserRequest {
  @ApiProperty({ type: () => String, example: 'test@fajny.pl'})
  email?: string;

  @ApiProperty({ type: () => String })
  password?: string;

  @ApiPropertyOptional({ type: () => String })
  firstName?: string;

  @ApiPropertyOptional({ type: () => String })
  lastName?: string;

  @ApiPropertyOptional({ type: () => String })
  phoneNumber?: string;

  @ApiProperty({ type: () => String })
  id: string;

  @ApiPropertyOptional({ type: () => Array })
  @IsOptional()
  role?: Role;
}

