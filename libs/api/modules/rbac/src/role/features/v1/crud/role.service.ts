import { DataSource, Repository } from "typeorm";

import { Permission } from "@owl-app/lib-api-core/rbac/types/permission";
import { RbacManager, Role } from "@owl-app/rbac-manager";
import { CrudTypeOrmQueryService, CrudTypeOrmQueryServiceOpts } from "@owl-app/lib-api-core/crud/service/crud-typeorm-query.service";
import { DeepPartial } from "@owl-app/crud-core";

import { RoleEntity } from "../../../../domain/entity/role.entity";
import { RoleSettingEntity } from "../../../../domain/entity/role-setting.entity";
import mapper from '../../../mapping'

export class RoleService extends CrudTypeOrmQueryService<RoleEntity> {
  constructor(
    readonly repository: Repository<RoleEntity>,
    opts: CrudTypeOrmQueryServiceOpts<RoleEntity>,
    private dataSource: DataSource,
    private rbacManager: RbacManager<Permission, Role>,
  ) {
    super(repository, opts);
  }

  public override async createOne(record: DeepPartial<RoleEntity>): Promise<RoleEntity>
  {
    const queryRunner = this.dataSource.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.rbacManager.addRole(
        mapper.toPersistence(record)
      );

      const roleSetting = new RoleSettingEntity()
      roleSetting.role = { name: record.name };
      roleSetting.displayName = record.setting?.displayName;
      roleSetting.theme = record.setting?.theme;

      await queryRunner.manager.save(roleSetting);
  
      await queryRunner.commitTransaction();

      return Object.assign(mapper.toResponse(record), { setting: roleSetting });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOne(id: number | string, update: DeepPartial<RoleEntity>): Promise<RoleEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.rbacManager.updateRole(
        id as string, mapper.toPersistence(update)
      );

      const roleSetting = new RoleSettingEntity()
      roleSetting.displayName = update.setting?.displayName;
      roleSetting.theme = update.setting?.theme;

      await queryRunner.manager.update(RoleSettingEntity, { role: { name: update.name } }, roleSetting);

      await queryRunner.commitTransaction();

      return Object.assign(mapper.toResponse(update), { setting: roleSetting });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteOne(id: string | number): Promise<RoleEntity> {
    const role = await this.findById(id as string);

    await this.rbacManager.removeRole(role.name);

    return role;
  }
}