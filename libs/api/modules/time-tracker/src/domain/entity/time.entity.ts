import type { Time, User, Tenant, Tag } from '@owl-app/lib-contracts';

import BaseEntity from '@owl-app/lib-api-core/database/entity/base.entity';

export class TimeEntity extends BaseEntity implements Time {
  tenant: Tenant;

  user: User;

  description: string;

  timeIntervalStart: Date | string;

  timeIntervalEnd: Date | string;

  tags: Tag[];
}
