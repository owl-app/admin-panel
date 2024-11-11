import type { Client, Project, Tenant } from '@owl-app/lib-contracts';

import BaseEntity from '@owl-app/lib-api-core/database/entity/base.entity';

export class ProjectEntity extends BaseEntity implements Project {
  id: string;

  tenant: Tenant;

  client: Client;

  name: string;

  archived: boolean;
}
