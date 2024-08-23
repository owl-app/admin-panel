import DomainEventableEntity from "@owl-app/lib-api-bulding-blocks/database/entity/domain-eventable.entity";

export abstract class BaseAuthItemEntity extends DomainEventableEntity
{
  type: string;

  name: string;

  description: string;

  ruleName: string;

  collection: string;

  createdAt: Date;

  updatedAt: Date;
}
