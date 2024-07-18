import { User } from './user';

export type Company = {
  id: string;
  name: string;
  email: string;
  address: string;
  users: User[];
}

export type CompanyAware = {
  company: Company;
}
