import { Item } from "./base.item";

/**
 * Rule represents a business constraint that may be associated with a role or a permission.
 */
export interface IRuleInterface
{
    /**
     * Executes the rule.
     *
     * @param string userId The user ID. This should be a string representing the unique identifier of a user.
     * @param Item item The role or permission that this rule is associated with.
     * @param array parameters Parameters passed to @see CheckAccessInterface::userHasPermission().
     *
     * @return bool Whether the rule permits the auth item it is associated with.
     */
    execute(userId: string, item:Item, parameters?: Array<any>): boolean;
}
