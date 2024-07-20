import { Company, Tenant, User } from '@owl-app/lib-contracts';

export class UserEntity implements User {
  id: string;

  company: Company;

  tenant: Tenant;

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
