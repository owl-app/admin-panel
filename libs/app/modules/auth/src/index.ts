
import { defineModule } from '@owl-app/lib-app-core/application/defines/module'
import { AuthLayout } from '@owl-app/lib-app-core/layouts/auth'

import LoginRoute from './features/login/login.vue';
import RecoveryPasswordRoute from './features/recovery-password/recovery-password.vue';

export default defineModule({
  id: 'users',
  name: '$t:auth_module',
  icon: 'people_alt',
  routes: {
    public: [
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
        name: 'recovery-password',
        path: 'recovery-password',
        component: RecoveryPasswordRoute,
        meta: {
          public: true,
        },
      }
    ]
  }
})
