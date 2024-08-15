
import { defineModule } from '@owl-app/lib-app-core/application/defines/module'

import ListRoute from './features/list/list.vue';

export default defineModule({
  id: 'client',
  name: '$t:client_module',
  icon: 'people_alt',
  routes: {
    private: [
      {
        name: 'client-list',
        path: 'clients',
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
