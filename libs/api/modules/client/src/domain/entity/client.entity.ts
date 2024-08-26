import DomainEventableEntity from "@owl-app/lib-api-bulding-blocks/database/entity/domain-eventable.entity";
import type { Client, Tenant } from '@owl-app/lib-contracts';

export class ClientEntity extends DomainEventableEntity implements Client {
  id: string;

  tenant: Tenant;

  name: string;

  email: string;

  address: string;

  description: string;
}
