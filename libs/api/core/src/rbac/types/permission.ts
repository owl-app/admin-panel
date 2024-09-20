import { Permission as BasePermission } from "@owl-app/rbac-manager";

export class Permission extends BasePermission
{
  refer: string;

  collection: string;

  constructor(
    name: string,
    description: string | null = null,
    ruleName: string | null = null,
    createdAt: Date | null = null,
    updatedAt: Date | null = null,
    collection: string,
    refer: string,
  ) {
    super(name, description, ruleName, createdAt, updatedAt);

    this.collection = collection;
    this.refer = refer;
  }
}