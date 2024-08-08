export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
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
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'dashboard',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'dashboard',
      displayName: 'menu.projects',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'dashboard',
      displayName: 'menu.payments',
      meta: {
        icon: 'credit_card',
      },
      children: [
        {
          name: 'dashboard',
          displayName: 'menu.payment-methods',
        },
        {
          name: 'dashboard',
          displayName: 'menu.pricing-plans',
        },
        {
          name: 'dashboard',
          displayName: 'menu.billing',
        },
      ],
    },
    {
      name: 'dashboard',
      displayName: 'menu.auth',
      meta: {
        icon: 'login',
      },
      children: [
        {
          name: 'dashboard',
          displayName: 'menu.login',
        },
        {
          name: 'dashboard',
          displayName: 'menu.signup',
        },
        {
          name: 'dashboard',
          displayName: 'menu.recover-password',
        },
      ],
    },

    {
      name: 'dashboard',
      displayName: 'menu.faq',
      meta: {
        icon: 'quiz',
      },
    },
    {
      name: 'dashboard',
      displayName: 'menu.404',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'dashboard',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'dashboard',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
