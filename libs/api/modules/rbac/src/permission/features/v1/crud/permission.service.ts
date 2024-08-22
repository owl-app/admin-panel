import { Repository } from "typeorm";

import { Manager } from "@owl-app/rbac-manager";
import { CrudTypeOrmQueryService, CrudTypeOrmQueryServiceOpts } from "@owl-app/lib-api-bulding-blocks/crud/service/crud-typeorm-query.service";
import { DeepPartial } from "@owl-app/crud-core";

import { PermissionEntity } from "../../../../domain/entity/permission.entity";
import mapper from '../../../mapping'

export class PermissionService extends CrudTypeOrmQueryService<PermissionEntity> {
  constructor(
    readonly repository: Repository<PermissionEntity>,
    opts: CrudTypeOrmQueryServiceOpts<PermissionEntity>,
    private rbacManager: Manager,
  ) {
    super(repository, opts);
  }

  public override async createOne(record: DeepPartial<PermissionEntity>): Promise<PermissionEntity>
  {
      const addedPermission = await this.rbacManager.addPermission(
        mapper.toPersistence(record)
      );

      return Object.assign(mapper.toResponse(addedPermission));
  }

  async updateOne(id: number | string, update: DeepPartial<PermissionEntity>): Promise<PermissionEntity> {
    const updatedPermission = await this.rbacManager.updatePermission(
      id as string, mapper.toPersistence(update),
    );

    return mapper.toResponse(updatedPermission);
  }

  public async deleteOne(id: string | number): Promise<PermissionEntity> {
    const permission = await this.findById(id as string);

    await this.rbacManager.removePermission(permission.name);

    return permission;
  }
}