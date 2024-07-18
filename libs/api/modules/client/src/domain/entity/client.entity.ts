import type { Client, Company } from '@owl-app/lib-contracts';

export class ClientEntity implements Client {
  id: string;

  name: string;

  email: string;

  address: string;

  description: string;

  company: Company;
}
