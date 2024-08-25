import { SetMetadata } from '@nestjs/common';

export const ROUTE_PERMISSIONS_KEY = 'route_permissions';

export const RoutePermissions = (collection: string, action: string) =>
  SetMetadata(ROUTE_PERMISSIONS_KEY, `ROUTE_${collection.toUpperCase()}_${action.toUpperCase()}`);
