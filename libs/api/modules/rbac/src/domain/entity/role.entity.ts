import { RoleSetting } from '@owl-app/lib-contracts';
import { BaseAuthEntity } from './base-auth.entity';

export class RoleEntity extends BaseAuthEntity {
  constructor(public role: boolean) {
      super();
  }

  setting: RoleSetting;
}