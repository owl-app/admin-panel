import type { Client, Tenant } from '@owl-app/lib-contracts';

import BaseEntity from '@owl-app/lib-api-core/database/entity/base.entity';

export class ClientEntity extends BaseEntity implements Client {

  tenant: Tenant;

  name: string;

  email: string;

  address: string;

  description: string;

}
