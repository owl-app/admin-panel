import { Registry } from "@owl-app/registry";
import {
  isEmpty,
  isFunction,
  isNotEmpty,
  isNumeric,
  isObject,
} from '@owl-app/utils';
import { IAccessCheckerInterface } from './access-checker.interface';
import {
  IItemsStorageInterface,
  IAssignmentsStorageInterface,
  CustomFields,
} from './storage';
import {
  Item,
  Permission,
  Role,
  Assignment,
  TypesItem,
  CallbackDefaultRoleNames,
  UserId,
  AccessType,
  IRuleInterface,
} from './types';
import { InvalidArgumentException } from './exceptions';
import { RuntimeException } from './exceptions/runtime.exception';
import { ItemAlreadyExistsException } from './exceptions/item-alredy-exists.exception';
import { DefaultRoleNotFoundException } from './exceptions/default-role-not-found.exception';

/**
 * An authorization manager that helps with building RBAC hierarchy and check for permissions.
 */
export class Manager implements IAccessCheckerInterface {
  /**
   * A list of role names that are assigned to every user automatically without calling {@see assign()}.
   * Note that these roles are applied to users, regardless of their state of authentication.
   */
  private defaultRoleNames: Array<string> = [];

  private guestRoleName: string | null = null;

  constructor(
    readonly itemsStorage: IItemsStorageInterface,
    readonly assignmentsStorage: IAssignmentsStorageInterface,
    readonly serviceRegistryRules: Registry<IRuleInterface>,
    readonly enableDirectPermissions = false
  ) {}

  async userHasPermission(
    userId: UserId | null,
    permissionName: string,
    $parameters: Array<any>
  ): Promise<boolean> {
    if (userId === null) {
      return this.guestHasPermission(permissionName);
    }

    const parsedUserId = this.ensureStringUserId(userId);
    const assignments: Record<string, Assignment> =
      await this.assignmentsStorage.getByUserId(parsedUserId);

    if (isEmpty(assignments)) {
      return false;
    }

    return this.userHasItem(
      parsedUserId,
      await this.itemsStorage.getPermission(permissionName),
      $parameters,
      assignments
    );
  }

  /**
   * Checks the possibility of adding a child to parent.
   *
   * @param string parentName The name of the parent item.
   * @param string childName The name of the child item to be added to the hierarchy.
   *
   * @return bool Whether it is possible to add the child to the parent.
   */
  async canAddChild(parentName: string, childName: string): Promise<boolean> {
    return (
      (await this.canBeParent(parentName, childName)) &&
      !this.hasLoop(parentName, childName)
    );
  }

  /**
   * Adds an item as a child of another item.
   *
   * @param string parentName The name of the parent item.
   * @param string childName The name of the child item.
   *
   * @throws RuntimeException
   * @throws InvalidArgumentException
   *
   * @return self
   */
  async addChild(parentName: string, childName: string): Promise<this> {
    if (!this.hasItem(parentName)) {
      throw new InvalidArgumentException(
        `Either ${parentName} does not exist.`
      );
    }

    if (!this.hasItem(childName)) {
      throw new InvalidArgumentException(`Either ${childName} does not exist.`);
    }

    if (parentName === childName) {
      throw new InvalidArgumentException(
        `Cannot add ${parentName} as a child of itself.`
      );
    }

    if (!this.canBeParent(parentName, childName)) {
      throw new InvalidArgumentException(
        `Can not add ${childName} role as a child of ${parentName} permission.`
      );
    }

    if (await this.hasLoop(parentName, childName)) {
      throw new RuntimeException(
        `Cannot add ${childName} as a child of ${parentName}. A loop has been detected.`
      );
    }

    const children = await this.itemsStorage.getChildren(parentName);

    if (isNotEmpty(children[childName])) {
      throw new RuntimeException(
        `The item ${parentName} already has a child ${childName}.`
      );
    }

    this.itemsStorage.addChild(parentName, childName);

    return this;
  }

  /**
   * Removes a child from its parent.
   * Note, the child item is not deleted. Only the parent-child relationship is removed.
   *
   * @param string parentName The name of the parent item.
   * @param string childName The name of the child item.
   *
   * @return self
   */
  async removeChild(parentName: string, childName: string): Promise<this> {
    const hasChild = await this.hasChild(parentName, childName);

    if (hasChild) {
      this.itemsStorage.removeChild(parentName, childName);
    }

    return this;
  }

  /**
   * Removes all children form their parent.
   * Note, the children items are not deleted. Only the parent-child relationships are removed.
   *
   * @param string parentName The name of the parent item.
   *
   * @return self
   */
  async removeChildren(parentName: string): Promise<this> {
    if (await this.itemsStorage.hasChildren(parentName)) {
      await this.itemsStorage.removeChildren(parentName);
    }

    return this;
  }

  /**
   * Returns a value indicating whether the child already exists for the parent.
   *
   * @param string parentName The name of the parent item.
   * @param string childName The name of the child item.
   *
   * @return bool Whether `$child` is already a child of `$parent`
   */
  async hasChild(parentName: string, childName: string): Promise<boolean> {
    const childrens = await this.itemsStorage.getChildren(parentName);

    return childName in childrens;
  }

  /**
   * Assigns a role or permission to a user.
   *
   * @param string itemName Name of the role or the permission to be assigned.
   * @param UserId userId The user ID.
   *
   * @throws Exception If the role or permission has already been assigned to the user.
   *
   * @return self
   */
  async assign(itemName: string, userId: UserId): Promise<this> {
    const parsedUserId = this.ensureStringUserId(userId);

    const item: AccessType | null = await this.itemsStorage.get(itemName);

    if (item === null) {
      throw new InvalidArgumentException(`There is no item named ${itemName}.`);
    }

    if (!this.enableDirectPermissions && item.type === TypesItem.PERMISSION) {
      throw new InvalidArgumentException(
        'Assigning permissions directly is disabled. Prefer assigning roles only.'
      );
    }

    if (await this.assignmentsStorage.get(itemName, parsedUserId) !== null) {
      throw new InvalidArgumentException(
        `${itemName} ${item.type} has already been assigned to user ${parsedUserId}.`
      );
    }

    await this.assignmentsStorage.add(itemName, parsedUserId);

    return this;
  }

  /**
   * Revokes a role or a permission from a user.
   *
   * @param string itemName The name of the role or permission to be revoked.
   * @param userId userId The user ID.
   *
   * @return self
   */
  revoke(itemName: string, userId: UserId): this {
    const parsedUserId = this.ensureStringUserId(userId);

    if (this.assignmentsStorage.get(itemName, parsedUserId) !== null) {
      this.assignmentsStorage.remove(itemName, parsedUserId);
    }

    return this;
  }

  /**
   * Revokes all roles and permissions from a user.
   *
   * @param userId userId The user ID.
   *
   * @return self
   */
  revokeAll(userId: UserId): this {
    const parsedUserId = this.ensureStringUserId(userId);

    this.assignmentsStorage.removeByUserId(parsedUserId);

    return this;
  }

  /**
   * Returns the roles that are assigned to the user via @see assign().
   * Note that child roles that are not assigned directly to the user will not be returned.
   *
   * @param UserId userId The user ID.
   *
   * @return Role[] All roles directly assigned to the user. The array is indexed by the role names.
   */
  async getRolesByUserId(userId: UserId): Promise<Array<Role>> {
    const parsedUserId = this.ensureStringUserId(userId)
    const assigments: Record<string, Assignment> =
        await this.assignmentsStorage.getByUserId(parsedUserId)
    const roles = this.getDefaultRoles();
    const resultRoles: Array<Promise<Role>> = [];

    Object.keys(assigments).forEach(async (name) => {
      resultRoles.push(this.itemsStorage.getRole(
        assigments[name].itemName
      ))
    })

    return [...roles, ...await Promise.all(resultRoles)];
  }

  /**
   * Returns child roles of the role specified. Depth isn't limited.
   *
   * @param string roleName Name of the role to get child roles for.
   *
   * @throws InvalidArgumentException If role was not found by `$roleName`.
   *
   * @return Role[] Child roles. The array is indexed by the role names. First element is an instance of the parent
   * role itself.
   */
  async getChildRoles(roleName: string): Promise<Array<Role>> {
    const role = await this.itemsStorage.getRole(roleName);
    if (role === null) {
      throw new InvalidArgumentException(`Role ${roleName} not found.`);
    }

    const result = {};

    await this.getChildrenRecursive(roleName, result);

    return [...[role], ...(await this.getRolesPresentInArray(result))];
  }

  /**
   * Returns all permissions that the specified role represents.
   *
   * @param string roleName The role name.
   *
   * @return Permission[] All permissions that the role represents. The array is indexed by the permission names.
   */
  async getPermissionsByRoleName(
    roleName: string
  ): Promise<Record<string, Permission>> {
    const result = {};
    await this.getChildrenRecursive(roleName, result);

    if (isEmpty(result)) {
      return {};
    }

    const normalizedPermissions = await this.normalizePermissions(result);

    return normalizedPermissions;
  }

  /**
   * Returns all permissions that the user has.
   *
   * @param UserId userId The user ID.
   *
   * @return Permission[] All permissions that the user has. The array is indexed by the permission names.
   */
  async getPermissionsByUserId(
    userId: UserId
  ): Promise<Record<string, Permission>> {
    const parsedUserId = this.ensureStringUserId(userId);

    return Object.assign(
      await this.getInheritedPermissionsByUser(parsedUserId)
    );
  }

  /**
   * @param UserId userId
   *
   * @return string
   */
  ensureStringUserId(userId: UserId): string {
    if (!(typeof userId === 'string' || userId instanceof String) && !isNumeric(userId) && !isObject(userId)) {
      throw new InvalidArgumentException(
        `User ID must be a string, an integer, or an object with id "__toString()", ${userId} given.`
      );
    }

    return (typeof userId === 'object' ? userId.id : userId).toString();
  }

  /**
   * Returns all user IDs assigned to the role specified.
   *
   * @param string roleName The role name.
   *
   * @return array Array of user ID strings.
   */
  async getUserIdsByRoleName($roleName: string): Promise<Array<string>> {
    const result: Array<string> = [];
    const roles = [
      ...[$roleName],
      ...Object.keys(this.itemsStorage.getParents($roleName)),
    ];
    const userAssignments = await this.assignmentsStorage.getAll();

    Object.keys(userAssignments).forEach(async (userId) => {
      // eslint-disable-next-line array-callback-return
      roles.every((role: string): void => {
        if (role in userAssignments[userId]) {
          result.push(userId);
        }
      });
    });

    return result;
  }

  async getAllRoles(): Promise<Role[]>
  {
    const roles = await this.itemsStorage.getRoles();

    return roles;
  }

  /**
   * @param Role $role
   *
   * @throws ItemAlreadyExistsException
   */
  async addRole(role: Role, customFields?: CustomFields[]): Promise<Role> {
    await this.addItem(role, customFields);

    return role;
  }

  /**
   * @param string name The role name.
   */
  async removeRole(name: string): Promise<void> {
    this.removeItem(name);
  }

  /**
   * @param string name The role name.
   * @param Role role
   *
   * @return self
   */
  async updateRole(name: string, role: Role): Promise<Role> {
    await this.checkItemNameForUpdate(role, name);

    await this.itemsStorage.update(name, role);
    await this.assignmentsStorage.renameItem(name, role.name);

    return role;
  }

  async getAllPermissions(): Promise<Permission[]>
  {
    const itemSorages = await this.itemsStorage.getPermissions();

    return itemSorages;
  }

  /**
   * @param Permission permission
   *
   * @throws ItemAlreadyExistsException
   *
   * @return self
   */
  async addPermission(permission: Permission, customField?: CustomFields[]): Promise<Permission> {
    await this.addItem(permission, customField);

    return permission;
  }

  /**
   * @param string permissionName The permission name.
   *
   * @return self
   */
  async removePermission(permissionName: string): Promise<this> {
    await this.removeItem(permissionName);
  
    return this;
  }

  /**
   * @param string name The permission name.
   * @param Permission permission
   *
   * @return self
   */
  async updatePermission(name: string, permission: Permission): Promise<Permission> {
    await this.checkItemNameForUpdate(permission, name);

    await this.itemsStorage.update(name, permission);
    await this.assignmentsStorage.renameItem(name, permission.name);

    return permission;
  }

  /**
   * Set default role names.
   *
   * @param Closure|string[] roleNames Either array of role names or a closure returning it.
   *
   * @throws InvalidArgumentException When `$roles` is neither array nor closure.
   * @throws RuntimeException When callable returns not array.
   */
  setDefaultRoleNames(
    roleNames: CallbackDefaultRoleNames | Array<string>
  ): this {
    if (Array.isArray(roleNames)) {
      this.defaultRoleNames = roleNames;
      return this;
    }

    if (isFunction(roleNames)) {
      const defaultRoleNames = roleNames();

      if (Array.isArray(defaultRoleNames)) {
        throw new RuntimeException(
          'Default role names closure must return an array.'
        );
      }
      this.defaultRoleNames = defaultRoleNames;
      return this;
    }

    throw new InvalidArgumentException(
      'Default role names must be either an array or a closure.'
    );
  }

  /**
   * Returns default role names.
   *
   * @return string[] Default role names.
   */
  getDefaultRoleNames(): Array<string> {
    return this.defaultRoleNames;
  }

  /**
   * Returns default roles.
   *
   * @return Role[] Default roles. The array is indexed by the role names.
   */
  getDefaultRoles(): Array<Role> {
    const roles: Array<Role> = [];

    Object.values(this.defaultRoleNames).forEach(async (roleName: string) => {
      const role = await this.itemsStorage.getRole(roleName);

      if (role === null) {
        throw new DefaultRoleNotFoundException(
          `Default role ${roleName} not found.`
        );
      }

      roles.push(role);
    });

    return roles;
  }

  /**
   * Set guest role name.
   *
   * @param string|null $name The guest role name.
   */
  setGuestRoleName(name: string | null): this {
    this.guestRoleName = name;
    return this;
  }

  /**
   * Executes the rule associated with the specified role or permission.
   *
   * If the item does not specify a rule, this method will return `true`. Otherwise, it will
   * return the value of @see RuleInterface::execute().
   *
   * @param string user The user ID. This should be a string representing the unique identifier of a user.
   * @param Item item The role or the permission that needs to execute its rule.
   * @param array params Parameters passed to @see AccessCheckerInterface::userHasPermission() and will be passed
   * to the rule.
   *
   * @throws RuntimeException If the role or the permission has an invalid rule.
   *
   * @return bool The return value of @see RuleInterface::execute(). If the role or the permission does not specify
   * a rule, `true` will be returned.
   */
  private executeRule(user: string, item: Item, params: Array<any>): boolean {
    if (
      item.ruleName === null ||
      item.ruleName === null ||
      !this.serviceRegistryRules.has(item.ruleName)
    ) {
      return true;
    }

    return this.serviceRegistryRules
      .get(item.ruleName)
      .execute(user, item, params);
  }

  /**
   * @throws ItemAlreadyExistsException
   */
  private async addItem(item: Item, customField?: CustomFields[]): Promise<void> {
    if (await this.itemsStorage.exists(item.name)) {
      throw new ItemAlreadyExistsException(item);
    }

    const date = new Date();
    if (!item.hasCreatedAt()) {
      item.createdAt = date;
    }
    if (!item.hasUpdatedAt()) {
      item.updatedAt = date;
    }

    await this.itemsStorage.add(item, customField);
  }

  private async hasItem(name: string): Promise<boolean> {
    return (await this.itemsStorage.get(name)) !== null;
  }

  private async normalizePermissions(
    permissionNames: Record<string, boolean>
  ): Promise<Record<string, Permission>> {
    const normalizePermissions: Record<string, Permission> = {};
    const resultPermissions: Array<Promise<Permission>> = [];
  
    Object.keys(permissionNames).forEach(async (permissionName) => {
      resultPermissions.push(this.itemsStorage.getPermission(permissionName))
    })

    const permissions = await Promise.all(resultPermissions);

    permissions.forEach((permission) => { 
      normalizePermissions[permission.name] = permission
    })

    return normalizePermissions;
  }

  /**
   * Returns all permissions that are directly assigned to user.
   *
   * @param string $userId The user ID.
   *
   * @return Permission[] All direct permissions that the user has. The array is indexed by the permission names.
   */
  private async getDirectPermissionsByUser(
    userId: string
  ): Promise<Record<string, Permission>> {
    const permissions: Record<string, Permission> = {};
    const assigments = await this.assignmentsStorage.getByUserId(userId);

    Object.keys(assigments).forEach(async (name) => { 
      const permission = await this.itemsStorage.getPermission(
        assigments[name].itemName
      );

      if (permission !== null) {
        permissions[name] = permission;
      }
    });

    return permissions;
  }

  /**
   * Returns all permissions that the user inherits from the roles assigned to him.
   *
   * @param string $userId The user ID.
   *
   * @return Permission[] All inherited permissions that the user has. The array is indexed by the permission names.
   */
  private async getInheritedPermissionsByUser(
    userId: string
  ): Promise<Record<string, Permission>> {
    const assignments = await this.assignmentsStorage.getByUserId(userId);
    const result:Record<string, boolean> = {};
    const resultChildrenResursive: Promise<void>[] = [];

    Object.keys(assignments).forEach(async (roleName) => { 
      resultChildrenResursive.push(this.getChildrenRecursive(roleName, result));
    })

    await Promise.all(resultChildrenResursive);

    if (isEmpty(result)) {
      return {};
    }

    const normalizedPermissions = await this.normalizePermissions(result);

    return normalizedPermissions;
  }

  private async removeItem(name: string): Promise<void> {
    if (await this.hasItem(name)) {
      await this.itemsStorage.remove(name);
      await this.assignmentsStorage.removeByItemName(name);
    }
  }

  /**
   * Performs access check for the specified user.
   *
   * @param string $user The user ID. This should be a string representing the unique identifier of a user.
   * @param Item|null $item The permission or the role that need access check.
   * @param array $params Name-value pairs that would be passed to rules associated with the permissions and roles
   * assigned to the user. A param with name 'user' is added to this array, which holds the value of `$userId`.
   * @param Assignment[] $assignments The assignments to the specified user.
   *
   * @throws RuntimeException
   *
   * @return bool Whether the operations can be performed by the user.
   */
  private userHasItem(
    user: string,
    item: Item | null,
    params: Array<Item>,
    assignments: Record<string, Assignment>
  ): boolean {
    if (item === null) {
      return false;
    }

    if (!this.executeRule(user, item, params)) {
      return false;
    }

    if (item.name in assignments) {
      return true;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const parentName in this.itemsStorage.getParents(item.name)) {
      if (parentName in assignments) {
        return true;
      }
    }

    return false;
  }

  private async guestHasPermission(permissionName: string): Promise<boolean> {
    if (this.guestRoleName === null) {
      return false;
    }

    if (
      this.itemsStorage.getRole(this.guestRoleName) === null ||
      !this.itemsStorage.hasChildren(this.guestRoleName)
    ) {
      return false;
    }

    const permissions = await this.itemsStorage.getChildren(
      this.guestRoleName
    );

    return isNotEmpty(permissions[permissionName]);
  }

  /**
   * Checks whether there is a loop in the authorization item hierarchy.
   *
   * @param string $parentName Name of the parent item.
   * @param string $childName Name of the child item that is to be added to the hierarchy.
   *
   * @return bool Whether a loop exists.
   */
  private async hasLoop(
    parentName: string,
    childName: string
  ): Promise<boolean> {
    if (childName === parentName) {
      return true;
    }

    const children = await this.itemsStorage.getChildren(childName);

    if (isEmpty(children)) {
      return false;
    }

    return Object.values(children).every(async (groupChild: Item) => {
      const hasLoop = await this.hasLoop(parentName, groupChild.name);

      if (hasLoop) {
        return true;
      }

      return false;
    });
  }

  /**
   * Recursively finds all children and grand children of the specified item.
   *
   * @param string $name The name of the item whose children are to be looked for.
   * @param array<string, boolean> $result The children and grand children (in array keys).
   */
  private async getChildrenRecursive(
    name: string,
    result: Record<string, boolean>
  ): Promise<void> {
    const children = await this.itemsStorage.getChildren(name);
    const resultPromise: Array<Promise<void>> = []

    if (isEmpty(children)) {
      return;
    }

    Object.keys(children).forEach(async (childName) => {
      result[childName] = true;
      resultPromise.push(this.getChildrenRecursive(childName, result));
    });

    await Promise.all(resultPromise);
  }

  /**
   * @param true[] $array
   *
   * @return Role[]
   */
  private async getRolesPresentInArray(
    array: Record<string, boolean>
  ): Promise<Array<Role>> {
    const roles: Array<Role> = await this.itemsStorage.getRoles();

    return roles.filter((roleItem: Role) => roleItem.name in array);
  }

  private async canBeParent(
    parentName: string,
    childName: string
  ): Promise<boolean> {
    const parent: AccessType | null = await this.itemsStorage.get(parentName);

    if (parent === null) {
      throw new InvalidArgumentException(
        'There is no item named "$parentName".'
      );
    }

    const child: AccessType | null = await this.itemsStorage.get(childName);
    if (child === null) {
      throw new InvalidArgumentException(
        'There is no item named "$childName".'
      );
    }

    return (
      parent.type !== TypesItem.PERMISSION || child.type !== TypesItem.ROLE
    );
  }

  private async checkItemNameForUpdate(
    item: Item,
    name: string
  ): Promise<void> {
    if (item.name === name || !(await this.hasItem(item.name))) {
      return;
    }

    throw new InvalidArgumentException(`Unable to change the role or the permission name. The name ${item.name} is already used by another role or permission.`);
  }
}
