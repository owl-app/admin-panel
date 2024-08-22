
import { defineModule } from '@owl-app/lib-app-core/application/defines/module'

import ListRoleRoute from './routes/role-list.vue';
import ListPermissionRoute from './routes/permission-list.vue';

export default defineModule({
  id: 'rbac',
  name: '$t:rbac_module',
  icon: 'people_alt',
  routes: {
    private: [
      {
        name: 'role-list',
        path: 'roles',
        component: ListRoleRoute,
        meta: {
          private: true,
        },
      },
      {
        name: 'permission-list',
        path: 'permissions',
        component: ListPermissionRoute,
        meta: {
          private: true,
        },
      }
    ]
  }
})
