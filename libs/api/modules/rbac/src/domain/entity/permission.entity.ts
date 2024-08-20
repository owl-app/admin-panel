import { BaseAuthEntity } from './base-auth.entity';

export class PermissionEntity extends BaseAuthEntity {
  constructor(public permission: boolean) {
      super();
  }
}