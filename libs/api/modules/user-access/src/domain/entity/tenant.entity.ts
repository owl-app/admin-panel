import { Tenant, User } from '@owl-app/lib-contracts';
import BaseEntity from '@owl-app/lib-api-bulding-blocks/database/entity/base.entity';

export class TenantEntity extends BaseEntity implements Tenant {
  id: string;

  name: string;

  users: User[];
}
