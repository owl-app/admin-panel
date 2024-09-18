import { Registry } from "@owl-app/registry";
import {
  isEmpty,
  isFunction,
  isNotEmpty,
  isNumeric,
  isObject,
} from '@owl-app/utils';

import { ItemsStorage } from "./storage";

import {
  Item,
  Permission,
  Role,
  Assignment,
  TypesItem,
  CallbackDefaultRoleNames,
  UserId,
  AccessType,
  Rule,
} from './types';

// class DefaultRolesNotFoundException extends Error {}
// class ItemAlreadyExistsException extends Error {}

class RbacManager {
  private defaultRoleNames: string[] = [];
  private guestRoleName: string | null = null;

  constructor(
      readonly itemsStorage: ItemsStorage,
      readonly assignmentsStorage: AssignmentsStorageInterface,
      readonly serviceRegistryRules: Registry<Rule>,
      readonly enableDirectPermissions = false,
      readonly includeRolesInAccessChecks = false,
  ) {

  }

  async userHasPermission(
      userId: string | number | null,
      permissionName: string,
      parameters: Record<string, any> = {},
  ): Promise<boolean> {
      const item = await this.itemsStorage.get(permissionName);
      if (!item) return false;

      if (!this.includeRolesInAccessChecks && item.getType() === 'role') return false;

      const guestRole = userId === null ? this.getGuestRole() : null;
      if (userId === null && guestRole === null) return false;

      const hierarchy = await this.itemsStorage.getHierarchy(item.getName());

      const itemNames: string[] = [];

      Object.values(hierarchy).forEach((treeItem: { item: AccessType, children: AccessType }) => {
        itemNames.push(treeItem.item.getName());
      });

      const userItemNames = guestRole
          ? [guestRole.getName()]
          : await this.filterUserItemNames(String(userId), itemNames);

      const userItemNamesMap: Record<string, null> = {};
      
      userItemNames.forEach(userItemName => {
          userItemNamesMap[userItemName] = null;
      });

      for (let data of Object.values(hierarchy)) {
        if (
          !(data.item.getName() in userItemNamesMap) ||
          !this.executeRule(userId ? String(userId) : null, data.item, parameters)
        ) {
            continue;
        }

        let hasPermission = true;

        Object.values(data.children).forEach((childItem: AccessType) => {
          if (!this.executeRule(userId ? String(userId) : null, childItem, parameters)) {
            hasPermission = false;
            return;
          }
        });

        if (hasPermission) {
            return true;
        }
      }

      return false;
  }

  public canAddChild(parentName: string, childName: string): boolean {
      try {
          this.assertFutureChild(parentName, childName);
      } catch {
          return false;
      }
      return true;
  }

  public addChild(parentName: string, childName: string): this {
      this.assertFutureChild(parentName, childName);
      this.itemsStorage.addChild(parentName, childName);
      return this;
  }

  public removeChild(parentName: string, childName: string): this {
      this.itemsStorage.removeChild(parentName, childName);
      return this;
  }

  public removeChildren(parentName: string): this {
      this.itemsStorage.removeChildren(parentName);
      return this;
  }

  public hasChild(parentName: string, childName: string): boolean {
      return this.itemsStorage.hasDirectChild(parentName, childName);
  }

  public hasChildren(parentName: string): boolean {
      return this.itemsStorage.hasChildren(parentName);
  }

  public assign(itemName: string, userId: string | number, createdAt: number | null = null): this {
      userId = String(userId);

      const item = this.itemsStorage.get(itemName);
      if (!item) throw new Error(`There is no item named "${itemName}".`);

      if (!this.enableDirectPermissions && item.getType() === 'permission') {
          throw new Error('Assigning permissions directly is disabled. Prefer assigning roles only.');
      }

      if (this.assignmentsStorage.exists(itemName, userId)) return this;

      const assignment = new Assignment(userId, itemName, createdAt ?? Date.now());
      this.assignmentsStorage.add(assignment);
      return this;
  }

  public revoke(itemName: string, userId: string | number): this {
      this.assignmentsStorage.remove(itemName, String(userId));
      return this;
  }

  public revokeAll(userId: string | number): this {
      this.assignmentsStorage.removeByUserId(String(userId));
      return this;
  }

  public getItemsByUserId(userId: string | number): Item[] {
      // userId = String(userId);
      const assignments = this.assignmentsStorage.getByUserId(userId);
      const assignmentNames = Object.keys(assignments);

      return [
          ...this.getDefaultRoles(),
          ...this.itemsStorage.getByNames(assignmentNames),
          ...this.itemsStorage.getAllChildren(assignmentNames),
      ];
  }

  public getRolesByUserId(userId: string | number): Role[] {
      userId = String(userId);
      const assignments = this.assignmentsStorage.getByUserId(userId);
      const assignmentNames = Object.keys(assignments);

      return [
          ...this.getDefaultRoles(),
          ...this.itemsStorage.getRolesByNames(assignmentNames),
          ...this.itemsStorage.getAllChildRoles(assignmentNames),
      ];
  }

  public getChildRoles(roleName: string): Role[] {
      if (!this.itemsStorage.roleExists(roleName)) {
          throw new Error(`Role "${roleName}" not found.`);
      }
      return this.itemsStorage.getAllChildRoles(roleName);
  }

  public getPermissionsByRoleName(roleName: string): Permission[] {
      return this.itemsStorage.getAllChildPermissions(roleName);
  }

  public getPermissionsByUserId(userId: string | number): Permission[] {
      userId = String(userId);
      const assignments = this.assignmentsStorage.getByUserId(userId);
      if (Object.keys(assignments).length === 0) return [];

      const assignmentNames = Object.keys(assignments);
      return [
          ...this.itemsStorage.getPermissionsByNames(assignmentNames),
          ...this.itemsStorage.getAllChildPermissions(assignmentNames),
      ];
  }

  public getUserIdsByRoleName(roleName: string): string[] {
      const roleNames = [roleName, ...Object.keys(this.itemsStorage.getParents(roleName))];
      return this.assignmentsStorage
          .getByItemNames(roleNames)
          .map(assignment => assignment.getUserId());
  }

  public addRole(role: Role): this {
      this.addItem(role);
      return this;
  }

  public getRole(name: string): Role | null {
      return this.itemsStorage.getRole(name);
  }

  public updateRole(name: string, role: Role): this {
      this.assertItemNameForUpdate(role, name);
      this.itemsStorage.update(name, role);
      this.assignmentsStorage.renameItem(name, role.getName());
      return this;
  }

  public removeRole(name: string): this {
      this.removeItem(name);
      return this;
  }

  public addPermission(permission: Permission): this {
      this.addItem(permission);
      return this;
  }

  public getPermission(name: string): Permission | null {
      return this.itemsStorage.getPermission(name);
  }

  public updatePermission(name: string, permission: Permission): this {
      this.assertItemNameForUpdate(permission, name);
      this.itemsStorage.update(name, permission);
      this.assignmentsStorage.renameItem(name, permission.getName());
      return this;
  }

  public removePermission(name: string): this {
      this.removeItem(name);
      return this;
  }

  public setDefaultRoleNames(roleNames: string[] | (() => string[])): this {
      this.defaultRoleNames = Array.isArray(roleNames) ? roleNames : roleNames();
      return this;
  }

  public getDefaultRoleNames(): string[] {
      return this.defaultRoleNames;
  }

  public setGuestRoleName(name: string | null): this {
      this.guestRoleName = name;
      return this;
  }

  public getGuestRoleName(): string | null {
      return this.guestRoleName;
  }

  public getGuestRole(): Role | null {
      return this.guestRoleName ? this.getRole(this.guestRoleName) : null;
  }

  private addItem(item: Role | Permission): void {
      if (this.itemsStorage.exists(item.getName())) {
          throw new ItemAlreadyExistsException(item.getName());
      }
      this.itemsStorage.add(item);
  }

  private removeItem(name: string): void {
      if (!this.itemsStorage.exists(name)) {
          return;
      }

      this.itemsStorage.remove(name);
      this.assignmentsStorage.removeByItemName(name);
  }

  private assertItemNameForUpdate(item: Role | Permission, oldName: string): void {
      if (item.getName() === oldName) {
          return;
      }

      if (this.itemsStorage.exists(item.getName())) {
          throw new ItemAlreadyExistsException(item.getName());
      }
  }

  async assertFutureChild(parentName: string, childName: string): Promise<void> {
      const parent = await this.itemsStorage.get(parentName);
      if (!parent) {
          throw new Error(`There is no item named "${parentName}".`);
      }

      const child = await this.itemsStorage.get(childName);
      if (!child) {
          throw new Error(`There is no item named "${childName}".`);
      }

      if (parent.getName() === child.getName()) {
          throw new Error(`Cannot add "${parent.getName()}" as a child of itself.`);
      }

      if (!this.canBeParent(parent)) {
          throw new Error(`Cannot add "${child.getName()}" as a child of "${parent.getName()}".`);
      }

      if (!this.canBeChild(child)) {
          throw new Error(`Cannot add "${child.getName()}" as a child of "${parent.getName()}".`);
      }

      if (this.itemsStorage.hasChild(child.getName(), parent.getName())) {
          throw new Error(`"${parent.getName()}" already has a child "${child.getName()}".`);
      }

      if (this.detectLoop(parent.getName(), child.getName())) {
          throw new Error(`Cannot add "${child.getName()}" as a child of "${parent.getName()}" because it would create a loop.`);
      }
  }

  private detectLoop(parentName: string, childName: string): boolean {
      const queue = [parentName];
      while (queue.length > 0) {
          const name = queue.pop();
          if (name === childName) {
              return true;
          }
          const children = this.itemsStorage.getAllChildren([name!]);
          for (const child of children) {
              queue.push(child.getName());
          }
      }
      return false;
  }

  private canBeParent(item: Item): boolean {
      return item.getType() === 'role';
  }

  private canBeChild(item: Item): boolean {
      return item.getType() === 'permission' || item.getType() === 'role';
  }

  private executeRule(userId: string | null, item: Item, params: Record<string, any>): boolean {
      const ruleName = item.getRuleName();
      if (!ruleName) return true;
      return this.ruleFactory.create(ruleName).execute(userId, item, params);
  }

  private getDefaultRoles(): Role[] {
      if (this.defaultRoleNames.length === 0) return [];
      return this.itemsStorage.getRolesByNames(this.defaultRoleNames);
  }

  async filterUserItemNames(userId: string, itemNames: string[]): Promise<string[]> {
    const filterUserItemNames = await this.assignmentsStorage.filterUserItemNames(userId, itemNames),

      return [
          ...filterUserItemNames,
          ...this.defaultRoleNames,
      ];
  }
}
