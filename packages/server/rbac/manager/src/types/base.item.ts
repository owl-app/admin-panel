export enum TypesItem {
  ROLE = 'role',
  PERMISSION = 'permission',
}

/**
 * Items are RBAC hierarchy entities that could be assigned to the user.
 * Both roles and permissions are items.
 */
export abstract class Item {

  /**
   * Type of the item.
   */
  abstract readonly type: string;

  /**
   * The name of the item. This must be globally unique.
   */
  readonly name: string;

  /**
   * The item description.
   */
  readonly description: string | null = '';

  /**
   * Name of the rule associated with this item.
   */
  readonly ruleName: string | null = null;

  /**
   * Representing the item creation time.
   */
  private _createdAt: Date | null = null;

  /**
   * Representing the item updating time.
   */
  private _updatedAt: Date | null = null;

  constructor(
    name: string,
    description: string | null = null,
    ruleName: string | null = null,
    createdAt: Date | null = null,
    updatedAt: Date | null = null,
  ) {
    this.name = name;
    this.description = description;
    this.ruleName = ruleName;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * @return string Type of the item.
   */
  abstract getType(): string;

  getName(): string
  {
    return this.name;
  }


  public get createdAt(): Date | null {
    return this._createdAt;
  }

  public set createdAt(createdAt: Date | null) {
    this._createdAt = createdAt;
  }

  public get updatedAt(): Date | null {
    return this._updatedAt;
  }

  public set updatedAt(updatedAt: Date | null) {
    this._updatedAt = updatedAt;
  }

  public hasCreatedAt(): boolean {
    return this._createdAt !== null;
  }

  public hasUpdatedAt(): boolean {
    return this._updatedAt !== null;
  }

  toArray(): [string, string | null, string | null, Date | null, Date | null]
  {
    return  [
      this.name,
      this.description,
      this.ruleName,
      this._createdAt,
      this._updatedAt
    ];
  }
}
