import { DataSource } from 'typeorm'
import moment from 'moment'

import {
  AllItemTypes,
  Assignment,
  IAssignmentsStorageInterface
} from '@owl-app/rbac-manager';
import { isEmpty } from '@owl-app/utils';

import { BaseStorage } from './base.storage';

type RawAssignment = {
  item_name: string,
  user_id: string,
  created_at: string,
};

export class AssignmentsStorage extends BaseStorage implements IAssignmentsStorageInterface {
  constructor(dataSource: DataSource, readonly tableName: string) {
    super(dataSource)
  }

  async getAll(): Promise<AllItemTypes> {

    const rawAssignments: Array<RawAssignment> = await this.singleQuery(`SELECT * FROM ${this.tableName}`);
    const assignments: AllItemTypes = {};

    Object.values(rawAssignments).forEach((item: RawAssignment) => {
      assignments[item.user_id][item.item_name] = new Assignment(item.user_id, item.item_name, new Date(item.created_at));
    });

    return assignments;
  }

  async getByUserId(userId: string): Promise<Record<string, Assignment>>
  {
    const rawAssignments: Array<RawAssignment> = await this.singleQuery(`SELECT * FROM ${this.tableName} WHERE user_id = ?`, [userId]);
    const assignments: Record<string, Assignment> = {};

    Object.values(rawAssignments).forEach((item: RawAssignment) => {
      assignments[item.item_name] = new Assignment(userId, item.item_name, new Date(item.created_at));
    });

    return assignments;
  }

  async get(item_name: string, userId: string): Promise<Assignment | null>
  {
    const rawAssignment: RawAssignment = await this.singleQuery(`
      SELECT * FROM ${this.tableName} 
      WHERE item_name = ? AND user_id = ? LIMIT 1
    `, [item_name, userId]);

    return isEmpty(rawAssignment) ? null : new Assignment(rawAssignment.user_id, rawAssignment.item_name, new Date(rawAssignment.created_at));
  }

  async add(item_name: string, userId: string): Promise<void> {
    await this.singleQuery(`INSERT INTO ${this.tableName} (item_name, user_id, created_at) VALUES(?,?,?)`,
      [
        item_name,
        userId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
      ]
    );
  }

  async hasItem(itemName: string): Promise<boolean>
  {
    const result: Array<RawAssignment> = await this.singleQuery(`SELECT * FROM ${this.tableName} WHERE item_name = ? LIMIT 1`, [itemName]);
  
    return result.length > 0 ? true : false;
  }

  renameItem(oldName: string, newName: string): void
  {
    // skip
  }

  async remove(itemName: string, userId: string): Promise<void>
  {
    await this.singleQuery(`DELETE FROM ${this.tableName} WHERE item_name = ? AND user_id = ?`,
      [
        itemName,
        userId
      ]
    );
  }

  async removeByUserId(userId: string): Promise<void>
  {
    await this.singleQuery(`DELETE FROM ${this.tableName} WHERE user_id = ?`,
      [
        userId
      ]
    );
  }

  async removeByItemName(itemName: string): Promise<void>
  {
    await this.singleQuery(`DELETE FROM ${this.tableName} WHERE item_name = ?`,
    [
      itemName
    ]
  );
  }

  async clear(): Promise<void>
  {
    await this.singleQuery(`DELETE FROM ${this.tableName}`);
  }
}
