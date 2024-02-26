import { DataSource, QueryRunner } from 'typeorm'
import moment from 'moment'

import { AccessType, IItemsStorageInterface, Item, Permission, Role, TypesItem } from '@owl-app/rbac-manager'
import { isEmpty } from '@owl-app/utils'

import { BaseStorage } from './base.storage'

type RawItem = {
  type: TypesItem.PERMISSION | TypesItem.ROLE,
  name: string,
  description: string|null,
  rule_name: string|null,
  created_at: string|null,
  updated_at: string|null,
}

type RawItemChild = {
  parent: string,
  child: string,
}

export class ItemStorage extends BaseStorage implements IItemsStorageInterface {

  readonly childrenTableName: string | null;

  constructor(
    dataSource: DataSource,
    readonly tableName: string,
    childrenTableName: string | null = null
  ) {
    super(dataSource);
    this.childrenTableName = childrenTableName ?? tableName + '_child';
  }

  async clear(): Promise<void>
  {
    await this.transactional(async (queryRunner: QueryRunner): Promise<void> => {
      await queryRunner.query(`DELETE FROM ${this.childrenTableName}`);
      await queryRunner.query(`DELETE FROM ${this.tableName}`);
    })
  }

  async getAll(): Promise<Array<Item>>
  {
    const rawItems: Array<RawItem> = await this.singleQuery(`SELECT * FROM ${this.childrenTableName}`);

    return rawItems.map(
        (item): Item => {

          return this.createItem(item)
        }
    );
  }

  async get(name: string): Promise<AccessType | null>
  {
    const rawItem: Array<RawItem> = await this.singleQuery(`SELECT * FROM ${this.tableName} WHERE name = "${name}" LIMIT 1`);

    return isEmpty(rawItem) ? null : this.createItem(rawItem[0]);
    
  }

  async exists(name: string): Promise<boolean>
  {
    const result: Array<RawItem> = await this.singleQuery(`SELECT * FROM ${this.tableName} WHERE name = "${name}" LIMIT 1`);

    return result.length > 0 ? true : false;
  }

  async add(item: Item): Promise<void>
  {
    await this.singleQuery(`INSERT INTO ${this.tableName} (name, description, rule_name, created_at, updated_at, type) VALUES(?,?,?,?,?,?)`,
      [
        item.name,
        item.description,
        item.ruleName,
        moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        item.type
      ]
    );
  }

  async update(name: string, item: Item): Promise<void>
  {
    item.updatedAt = new Date();

    await this.transactional(async (queryRunner: QueryRunner): Promise<void> => {
      const rawItems: Array<RawItemChild> = await queryRunner.query(`SELECT * FROM ${this.childrenTableName} WHERE parent = ? OR child = ?`, [name, name]);

      if(rawItems.length > 0) {
        await this.removeRelatedItemsChildren(queryRunner, name);
      }

      await queryRunner.query(`UPDATE ${this.tableName} SET name=?, description=?, rule_name=?, updated_at=? WHERE name=?`, [
        item.name,
        item.description,
        item.ruleName,
        moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        name,
      ]);

      if(rawItems.length > 0) {
        const itemsChildren: Array<Array<string>> = rawItems.map((itemChild: RawItemChild): Array<string> => {
            if (itemChild.parent === name) {
                itemChild.parent = item.name;
            }

            if (itemChild.child === name) {
                itemChild.child = item.name;
            }

            return [itemChild.parent, itemChild.child];
        });

        let sqlMoveChildrens = `INSERT INTO ${this.childrenTableName} (parent, child) VALUES `;
        itemsChildren.map((children) => {
          sqlMoveChildrens += `("${children[0]}","${children[1]}"),`;
        })
        await queryRunner.query(sqlMoveChildrens.slice(0, -1));
      }
    })
  }
  async remove(name: string): Promise<void>
  {
    await this.transactional(async (queryRunner: QueryRunner): Promise<void> => {
      await this.removeRelatedItemsChildren(queryRunner, name);
      await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = ?`, [name]);
    })
  }

  async getRoles(): Promise<Role[]>
  {
    return await this.getItemsByType(TypesItem.ROLE);
  }

  async getRole(name: string): Promise<Role | null>
  {
    return await this.getItemByTypeAndName(TypesItem.ROLE, name);
  }

  async clearRoles(): Promise<void>
  {
    await this.clearItemsByType(TypesItem.ROLE);
  }

  async getPermissions(): Promise<Permission[]>
  {
    return this.getItemsByType(TypesItem.PERMISSION);
  }

  async getPermission(name: string): Promise<Permission | null>
  {
    return await this.getItemByTypeAndName(TypesItem.PERMISSION, name);
  }

  async clearPermissions(): Promise<void>
  {
    await this.clearItemsByType(TypesItem.PERMISSION);
  }

  async getParents(name: string): Promise<Record<string, Item>>
  {
    const rawItems: Array<RawItem> = await this.singleQuery(`
      SELECT DISTINCT item.* FROM (
        SELECT @r AS child_name,
        (SELECT @r := parent FROM ${this.childrenTableName} WHERE child = child_name) AS parent,
        @l := @l + 1 AS level
        FROM (SELECT @r := ${name}, @l := 0) val, ${this.childrenTableName}
      ) s
      LEFT JOIN ${this.tableName} AS item ON item.name = s.child_name
      WHERE item.name != ${name}
    `);
    const items: Record<string, Item> = {};

    Object.values(rawItems).forEach((item: RawItem) => {
      items[item.name] = this.createItem(item)
    });

    return items;
  }

  async getChildren(name: string): Promise<Record<string, Item>>
  {
    const rawItems: Array<RawItem> = await this.singleQuery(`
      SELECT DISTINCT item.* FROM (
        SELECT DISTINCT child
        FROM (SELECT * FROM ${this.childrenTableName} ORDER by parent) item_child_sorted,
        (SELECT @pv := ?) init
        WHERE find_in_set(parent, @pv) AND length(@pv := concat(@pv, ',', child))
      ) s
      LEFT JOIN ${this.tableName} AS item ON item.name = s.child
    `, [name]);
    const items: Record<string, Item> = {};

    Object.values(rawItems).forEach((item: RawItem) => {
      items[item.name] = this.createItem(item)
    });

    return items;
  }

  async hasChildren(name: string): Promise<boolean>
  {
    const result: Array<RawItem> = await this.singleQuery(`SELECT * FROM ${this.childrenTableName} WHERE parent = ? LIMIT 1`, [name]);

    return result.length > 0 ? true : false;
  }

  async addChild(parentName: string, childName: string): Promise<void>
  {
    await this.singleQuery(`INSERT INTO ${this.childrenTableName} (parent, child) VALUES(?,?)`,
      [
        parentName,
        childName
      ]
    );
  }

  async removeChild(parentName: string , childName: string ): Promise<void>
  {
    await this.singleQuery(`DELETE FROM ${this.childrenTableName} WHERE parent = ? AND child = ?`,
      [
        parentName,
        childName
      ]
    );
  }

  async removeChildren(parentName: string): Promise<void>
  {
    await this.singleQuery(`DELETE FROM ${this.childrenTableName} WHERE parent = ?`,
      [
        parentName
      ]
    );
  }

  private async getItemsByType(type: TypesItem): Promise<Array<AccessType>>
  {
      const rawItems: Array<RawItem> = await this.singleQuery(`SELECT * FROM ${this.tableName} WHERE type = ?`, [type]);

      return rawItems.map(
          (item: RawItem): AccessType => {
            return this.createItem(item)
          }
      );
  }

  private async getItemByTypeAndName(type: TypesItem, name: string): Promise<AccessType | null>
  {
      const rawItem: Array<RawItem> = await this.singleQuery(`SELECT * FROM ${this.tableName} WHERE type = ? AND name = ?`, [type,name]);

      return isEmpty(rawItem) ? null : this.createItem(rawItem[0]);
  }

  private createItem(rawItem: RawItem): AccessType 
  {
    const properties = [
      rawItem.name,
      rawItem.description,
      rawItem.rule_name,
      rawItem.created_at !== null ? new Date(rawItem.created_at) : null,
      rawItem.updated_at !== null ? new Date(rawItem.updated_at) : null
    ] as const;

    return rawItem.type === TypesItem.PERMISSION ? new Permission(...properties) : new Role(...properties);
  }

  private async removeRelatedItemsChildren(queryRunner: QueryRunner, name: string): Promise<void>
  {
    await this.singleQuery(`DELETE FROM ${this.childrenTableName} WHERE parent = ? OR child = ?`, [name, name]);
  }

  private async clearItemsByType(type: string): Promise<void>
  {
    this.transactional(async (queryRunner: QueryRunner): Promise<void> => {
      let queryParentsSubQuery = '';
      let queryChildrenSubQuery = '';

      const parentsSubQuery: Array<Partial<RawItemChild>>= await queryRunner.query(`SELECT parents.parent FROM 
        (SELECT DISTINCT parent FROM ${this.childrenTableName}) as parents 
        LEFT JOIN ${this.tableName} as parent_items ON parent_items,name = parents.parent 
        parent_items.type = ${type}
      `);

      const childrenSubQuery: Array<Partial<RawItemChild>> = await queryRunner.query(`SELECT children.child FROM 
        (SELECT DISTINCT child FROM ${this.childrenTableName}) as children 
        LEFT JOIN ${this.tableName} as child_items ON child_items.name = children.child 
        WHERE child_items.type = ${type}
      `);

      parentsSubQuery.map((item: Partial<RawItemChild>) => queryParentsSubQuery += `"${item.parent}",`);
      childrenSubQuery.map((item: Partial<RawItemChild>) => queryChildrenSubQuery += `"${item.child}",`);

      await queryRunner.query(`DELETE FROM ${this.childrenTableName} 
        WHERE parent IN (${queryParentsSubQuery.slice(0, -1)}) OR child IN (${childrenSubQuery.slice(0, -1)})
      `);

      await queryRunner.query(`DELETE FROM ${this.tableName} WHERE type ${type}`);
    });
  }
}
