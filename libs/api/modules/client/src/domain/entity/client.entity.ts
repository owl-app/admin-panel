import type { Client, Tenant } from '@owl-app/lib-contracts';

export class ClientEntity implements Client {
  id: string;

  tenant: Tenant;

  name: string;

  email: string;

  address: string;

  description: string;
}
