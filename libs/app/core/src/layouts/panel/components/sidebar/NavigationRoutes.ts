export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string, untrackedPages?: string[] }
  children?: INavigationRoute[]
}

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
    },
    {
      name: 'client-list',
      displayName: 'clients',
      meta: {
        icon: 'sensor_occupied',
      },
    },
    {
      name: 'user-list',
      displayName: 'users',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'permissions',
      displayName: 'access_control',
      meta: {
        icon: 'admin_panel_settings',
      },
      children: [
        {
          name: 'role-list',
          displayName: 'roles',
          meta: {
            icon: 'guardian',
            untrackedPages: ['role-permission-assign'],
          },
        },
        {
          name: 'permission-list',
          displayName: 'permissions',
          meta: {
            icon: 'vpn_key',
          },
        },
      ],
    },
    // {
    //   name: 'dashboard',
    //   displayName: 'menu.projects',
    //   meta: {
    //     icon: 'folder_shared',
    //   },
    // },
    // {
    //   name: 'dashboard',
    //   displayName: 'menu.payments',
    //   meta: {
    //     icon: 'credit_card',
    //   },
    //   children: [
    //     {
    //       name: 'dashboard',
    //       displayName: 'menu.payment-methods',
    //     },
    //     {
    //       name: 'dashboard',
    //       displayName: 'menu.pricing-plans',
    //     },
    //     {
    //       name: 'dashboard',
    //       displayName: 'menu.billing',
    //     },
    //   ],
    // },
    // {
    //   name: 'dashboard',
    //   displayName: 'menu.auth',
    //   meta: {
    //     icon: 'login',
    //   },
    //   children: [
    //     {
    //       name: 'dashboard',
    //       displayName: 'menu.login',
    //     },
    //     {
    //       name: 'dashboard',
    //       displayName: 'menu.signup',
    //     },
    //     {
    //       name: 'dashboard',
    //       displayName: 'menu.recover-password',
    //     },
    //   ],
    // },

    // {
    //   name: 'dashboard',
    //   displayName: 'menu.faq',
    //   meta: {
    //     icon: 'quiz',
    //   },
    // },
    // {
    //   name: 'dashboard',
    //   displayName: 'menu.404',
    //   meta: {
    //     icon: 'vuestic-iconset-files',
    //   },
    // },
    // {
    //   name: 'dashboard',
    //   displayName: 'menu.preferences',
    //   meta: {
    //     icon: 'manage_accounts',
    //   },
    // },
    // {
    //   name: 'dashboard',
    //   displayName: 'menu.settings',
    //   meta: {
    //     icon: 'settings',
    //   },
    // },
  ] as INavigationRoute[],
}
