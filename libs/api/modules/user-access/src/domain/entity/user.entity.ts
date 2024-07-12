import { Company, User } from '@owl-app/lib-contracts';

export class UserEntity implements User {
  id: string;

  companies: Company[];

  email: string;

  username?: string;

  firstName?: string;

  lastName?: string;

  phoneNumber?: string;

  passwordHash?: string;

  isActive?: boolean;

  hashRefreshToken?: string;

  lastLogin?: Date;
}
