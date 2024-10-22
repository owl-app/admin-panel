
import { defineModule } from '@owl-app/lib-app-core/application/defines/module'

import ListRoute from './routes/list.vue';

export default defineModule({
  id: 'tag',
  name: '$t:tag_module',
  icon: 'sell',
  routes: {
    private: [
      {
        name: 'tag-list',
        path: 'tags',
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
