
import { defineModule } from '@owl-app/lib-app-core/application/defines/module'

import ListRoute from './routes/list.vue';

export default defineModule({
  id: 'user',
  name: '$t:user_module',
  icon: 'people_alt',
  routes: {
    private: [
      {
        name: 'user-list',
        path: 'users',
        component: ListRoute,
        props: (route) => ({
          ssoErrorCode: route.query.error ? route.query.code : null,
          logoutReason: route.query.reason,
        }),
        meta: {
          private: true,
        },
      }
    ]
  }
})
