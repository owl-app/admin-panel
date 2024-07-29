
import { defineModule } from '@owl-app/lib-app-core/application/defines/module'

import LoginRoute from './features/login/login.vue';

export default defineModule({
  id: 'users',
  name: '$t:user_directory',
  icon: 'people_alt',
  routes: {
    public: [
      {
        path: '/',
        redirect: '/login',
      },
      {
        name: 'login',
        path: 'login',
        component: LoginRoute,
        props: (route) => ({
          ssoErrorCode: route.query.error ? route.query.code : null,
          logoutReason: route.query.reason,
        }),
        meta: {
          public: true,
        },
      },
      {
        name: 'test',
        path: 'test',
        component: LoginRoute,
        props: (route) => ({
          ssoErrorCode: route.query.error ? route.query.code : null,
          logoutReason: route.query.reason,
        }),
      }
    ],
  }
})
