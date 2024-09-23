import { AvalilableCollections, CrudActions } from "@owl-app/lib-contracts";

import { usePermissions } from "../../../../composables/use-permissions";

export interface INavigationRoute {
  name: string;
  displayName: string;
  hasPermission: boolean;
  meta: {
    icon: string,
    untrackedPages?: string[],
  };
  children?: INavigationRoute[];
}

const { hasRoutePermission } = usePermissions();

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
      hasPermission: true
    },
    {
      name: 'time-list',
      displayName: 'time_tracker',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
      hasPermission: hasRoutePermission(CrudActions.LIST, AvalilableCollections.TIME),
    },
    {
      name: 'manage',
      displayName: 'manage',
      children: [ 
        {
          name: 'client-list',
          displayName: 'clients',
          meta: {
            icon: 'sensor_occupied',
          },
          hasPermission: hasRoutePermission(CrudActions.LIST, AvalilableCollections.CLIENT),
        },
      ]
    },
    {
      name: 'permissions',
      displayName: 'access_control',
      children: [
        {
          name: 'role-list',
          displayName: 'roles',
          meta: {
            icon: 'guardian',
            untrackedPages: ['role-permission-assign'],
          },
          hasPermission: hasRoutePermission(CrudActions.LIST, AvalilableCollections.ROLE),
        },
        {
          name: 'permission-list',
          displayName: 'permissions',
          meta: {
            icon: 'vpn_key',
          },
          hasPermission: hasRoutePermission(CrudActions.LIST, AvalilableCollections.PERMISSION),
        },
      ],
    },
    {
      name: 'system',
      displayName: 'system',
      children: [ 
        {
          name: 'user-list',
          displayName: 'users',
          meta: {
            icon: 'group',
          },
          hasPermission: hasRoutePermission(CrudActions.LIST, AvalilableCollections.USER),
        },
      ]
    },
  ] as INavigationRoute[],
}
