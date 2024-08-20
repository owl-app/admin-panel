import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Manager } from "@owl-app/rbac-manager";

import { RoleEntity } from "../../../../domain/entity/role.entity";
import { RoleSettingEntity } from "../../../../domain/entity/role-setting.entity";
import { CreateRoleRequest } from "../../../dto/create-role.request.dto";
import { UpdateRoleRequest } from "../../../dto/update-role.request.dto";
import mapper from '../../../mapping'

@Injectable()
export class RoleService {
  constructor(
    private dataSource: DataSource,
    @Inject('RBAC_MANAGER') readonly rbacManager: Manager,
  ) {}

  async createWithSetting(createRoleDto: CreateRoleRequest): Promise<Partial<RoleEntity>> {
    const queryRunner = this.dataSource.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const addedRole = await this.rbacManager.addRole(
        mapper.toPersistence(createRoleDto)
      );

      const roleSetting = new RoleSettingEntity()
      roleSetting.role = { name: addedRole.name };
      roleSetting.displayName = createRoleDto.setting?.displayName;
      roleSetting.theme = createRoleDto.setting?.theme;

      await queryRunner.manager.save(roleSetting);
  
      await queryRunner.commitTransaction();

      return { ...addedRole, setting: roleSetting };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateWithSetting(name: string, updateRoleDto: UpdateRoleRequest): Promise<Partial<RoleEntity>> {
    const queryRunner = this.dataSource.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedRole = await this.rbacManager.updateRole(
        name, mapper.toPersistence(updateRoleDto)
      );

      const roleSetting = new RoleSettingEntity()
      roleSetting.displayName = updateRoleDto.setting?.displayName;
      roleSetting.theme = updateRoleDto.setting?.theme;

      await queryRunner.manager.update(RoleSettingEntity, { role: { name: updatedRole.name } }, roleSetting);
  
      await queryRunner.commitTransaction();

      return { ...updatedRole, setting: roleSetting };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}