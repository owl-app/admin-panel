import { UserId } from "./types";

export interface IAccessCheckerInterface
{
    userHasPermission($userId: UserId, $permissionName: string, $parameters: Array<any>): Promise<boolean>;
}