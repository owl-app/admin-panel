
import { defineModule } from '@owl-app/lib-app-core/application/defines/module'

import ListRoute from './routes/list.vue';

export default defineModule({
  id: 'rbac',
  name: '$t:rbac_module',
  icon: 'people_alt',
  routes: {
    private: [
      {
        name: 'role-list',
        path: 'roles',
        component: ListRoute,
        meta: {
          private: true,
        },
      }
    ]
  }
})
