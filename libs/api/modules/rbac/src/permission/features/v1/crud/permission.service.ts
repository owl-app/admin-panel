import { Repository } from "typeorm";

import { Permission } from "@owl-app/lib-api-core/rbac/types/permission";
import { RbacManager, Role } from "@owl-app/rbac-manager";
import { CrudTypeOrmQueryService, CrudTypeOrmQueryServiceOpts } from "@owl-app/lib-api-core/crud/service/crud-typeorm-query.service";
import { DeepPartial } from "@owl-app/crud-core";

import { PermissionEntity } from "../../../../domain/entity/permission.entity";
import mapper from '../../../mapping';

export class PermissionService extends CrudTypeOrmQueryService<PermissionEntity> {
  constructor(
    readonly repository: Repository<PermissionEntity>,
    opts: CrudTypeOrmQueryServiceOpts<PermissionEntity>,
    private rbacManager: RbacManager<Permission, Role>
  ) {
    super(repository, opts);
  }

  public override async createOne(record: DeepPartial<PermissionEntity>): Promise<PermissionEntity>
  {
    this.resolveName(record);

    await this.rbacManager.addPermission(
      mapper.toPersistence(record),
      [
        { name: 'collection', value: record.collection },
        { name: 'refer', value: record.refer }
      ]
    );

    return Object.assign(mapper.toResponse(record));
  }

  async updateOne(id: number | string, update: DeepPartial<PermissionEntity>): Promise<PermissionEntity> {
    await this.rbacManager.updatePermission(
      id as string, mapper.toPersistence(update),
    );

    return mapper.toResponse(update);
  }

  public async deleteOne(id: string | number): Promise<PermissionEntity> {
    const permission = await this.findById(id as string);

    await this.rbacManager.removePermission(permission.name);

    return permission;
  }

  private resolveName(record: DeepPartial<PermissionEntity>): void {
    record.name = (`${record.refer}_${record.collection}_${record.name}`).toUpperCase();
  }
}