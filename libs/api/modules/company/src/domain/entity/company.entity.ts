import type { Company, User } from '@owl-app/lib-contracts';

export class CompanyEntity implements Company {
  id: string;

  name: string;

  email: string;
  
  address: string;
  
  users: User[];
}
