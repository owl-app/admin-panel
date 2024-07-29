
import LoginRoute from './features/login/login.vue';

export default {
  id: 'users',
  name: '$t:user_directory',
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
      }
    ],
  } 
  // preRegisterCheck(user, permissions) {
  // 	const admin = user.role.admin_access;
  // 	if (admin) return true;

  // 	const permission = permissions.find(
  // 		(permission) => permission.collection === 'directus_users' && permission.action === 'read',
  // 	);

  // 	return !!permission;
  // },
}
