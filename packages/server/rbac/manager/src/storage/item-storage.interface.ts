import { Role, Item, Permission, AccessType } from '../types';

/**
 * A storage for RBAC roles and permissions used in {@see Manager}.
 */
export interface IItemsStorageInterface
{
    /**
     * Removes all roles and permissions.
     */
    clear(): Promise<void>;

    /**
     * Returns all roles and permissions in the system.
     *
     * @return Item[] All roles and permissions in the system.
     */
    getAll(): Promise<Array<Item>>;

    /**
     * Returns the named role or permission.
     *
     * @param string name The role or the permission name.
     *
     * @return Item|null The role or the permission corresponding to the specified name. `null` is returned if no such
     * item.
     */
    get(name: string): Promise<AccessType | null>

    /**
     * Returns whether named role or permission exists.
     *
     * @param string name The role or the permission name.
     *
     * @return bool Whether named role or permission exists.
     */
    exists(name: string): Promise<boolean>;

    /**
     * Adds the role or the permission to RBAC system.
     *
     * @param Item item The role or the permission to add.
     */
    add(item: Item): Promise<void>;

    /**
     * Updates the specified role or permission in the system.
     *
     * @param string name The old name of the role or permission.
     * @param Item item Modified role or permission.
     */
    update(name: string, item: Item): Promise<void>;

    /**
     * Removes a role or permission from the RBAC system.
     *
     * @param string name Name of a role or a permission to remove.
     */
    remove(name: string): Promise<void>;

    /**
     * Returns all roles in the system.
     *
     * @return Role[] All roles in the system.
     */
    getRoles(): Promise<Role[]>

    /**
     * Returns the named role.
     *
     * @param string name The role name.
     *
     * @return Role|null The role corresponding to the specified name. `null` is returned if no such role.
     */
    getRole(name: string): Promise<Role | null>

    /**
     * Removes all roles.
     * All parent child relations will be adjusted accordingly.
     */
    clearRoles(): Promise<void>;

    /**
     * Returns all permissions in the system.
     *
     * @return Permission[] All permissions in the system.
     */
    getPermissions(): Promise<Permission[]>;

    /**
     * Returns the named permission.
     *
     * @param string name The permission name.
     *
     * @return Permission|null The permission corresponding to the specified name. `null` is returned if no such
     * permission.
     */
    getPermission(name: string): Promise<Permission | null>;

    /**
     * Removes all permissions.
     * All parent child relations will be adjusted accordingly.
     */
    clearPermissions(): Promise<void>;

    /**
     * Returns the parent permissions and/or roles.
     *
     * @param string name The child name.
     *
     * @return Item[] The parent permissions and/or roles.
     */
    getParents(name: string): Promise<Record<string, Item>>;

    /**
     * Returns the child permissions and/or roles.
     *
     * @param string name The parent name.
     *
     * @return Item[] The child permissions and/or roles.
     */
    getChildren(name: string): Promise<Record<string, Item>>;

    /**
     * Returns whether named parent has children.
     *
     * @param string name The parent name.
     *
     * @return bool Whether named parent has children.
     */
    hasChildren(name: string): Promise<boolean>

    /**
     * Adds a role or a permission as a child of another role or permission.
     *
     * @param string parentName Name of the parent to add child to.
     * @param string childName Name of the child to add.
     */
    addChild(parentName: string, childName: string): Promise<void>;

    /**
     * Removes a child from its parent.
     * Note, the child role or permission is not deleted. Only the parent-child relationship is removed.
     *
     * @param string parentName Name of the parent to remove child from.
     * @param string childName Name of the child to remove.
     */
    removeChild(parentName: string , childName: string ): Promise<void>;

    /**
     * Removed all children form their parent.
     * Note, the children roles or permissions are not deleted. Only the parent-child relationships are removed.
     *
     * @param string parentName Name of the parent to remove children from.
     */
    removeChildren(parentName: string): Promise<void>;
}
