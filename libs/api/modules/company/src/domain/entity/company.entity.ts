import type { Company, User } from '@owl-app/lib-contracts';

export class CompanyEntity implements Company {
  id: string;

  name: string;

  users: User[];
}
