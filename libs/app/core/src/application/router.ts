import { orderBy } from 'lodash';
import { createRouter, createWebHistory, NavigationGuard, NavigationHookAfter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { useUserStore } from '../stores/user';
import { getRootPath } from '../utils/get-root-path';
import PrivateNotFound from '../pages/private-not-found.vue'

import { useAppLifecycleEventRegistry } from './registry';
import { LIFECYCLE_EVENTS } from './contants';

export const defaultRoutes: RouteRecordRaw[] = [
	{
		name: 'private-404',
		path: '/:_(.+)+',
		component: PrivateNotFound,
	},
	// {
	// 	path: '/:pathMatch(.*)*',
	// 	redirect: { name: 'dashboard' },
	// },
	// {
	// 	path: '/',
	// 	redirect: '/login',
	// },
	// {
	// 	name: 'dashboard',
	// 	displayName: 'menu.dashboard',
	// 	meta: {
	// 	icon: 'vuestic-iconset-dashboard',
	// 	},
	// },
	// {
	// 	name: 'login',
	// 	path: '/login',
	// 	component: LoginRoute,
	// 	props: (route) => ({
	// 		ssoErrorCode: route.query.error ? route.query.code : null,
	// 		logoutReason: route.query.reason,
	// 	}),
	// 	meta: {
	// 		public: true,
	// 	},
	// },
	// {
	// 	name: 'reset-password',
	// 	path: '/reset-password',
	// 	component: ResetPasswordRoute,
	// 	meta: {
	// 		public: true,
	// 	},
	// },
	// {
	// 	name: 'register',
	// 	path: '/register',
	// 	component: RegisterRoute,
	// 	meta: {
	// 		public: true,
	// 	},
	// },
	// {
	// 	name: 'accept-invite',
	// 	path: '/accept-invite',
	// 	component: AcceptInviteRoute,
	// 	meta: {
	// 		public: true,
	// 	},
	// },
	// {
	// 	name: 'tfa-setup',
	// 	path: '/tfa-setup',
	// 	component: TFASetup,
	// 	meta: {
	// 		track: false,
	// 	},
	// },
	// {
	// 	name: 'logout',
	// 	path: '/logout',
	// 	component: LogoutRoute,
	// 	meta: {
	// 		public: true,
	// 	},
	// },
	// {
	// 	name: 'shared',
	// 	path: '/shared/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})',
	// 	component: ShareRoute,
	// 	meta: {
	// 		public: true,
	// 	},
	// },
	// {
	// 	name: 'private-404',
	// 	path: '/:_(.+)+',
	// 	component: PrivateNotFoundRoute,
	// },
];

export const router = createRouter({
	history: createWebHistory(getRootPath()),
	routes: defaultRoutes,
});

let firstLoad = true;

export const onBeforeEach: NavigationGuard = async (to, from, next) => {
	const appLifecycleEventRegistry = useAppLifecycleEventRegistry();

	console.log(appLifecycleEventRegistry)

	await Promise.all(
		orderBy(appLifecycleEventRegistry.request, ['priority'], 'desc')
			.filter(({event}) => event === LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH)
			.map(async (event) => {
				console.log('event', event)
				await event.callback(to, from, next)
			})
	)
			

	next();
	// const appStore = useAppStore();
	// // const serverStore = useServerStore();
	// const userStore = useUserStore();

	// // First load
	// //if (firstLoad) {
	// //	firstLoad = false;

	// 	// Try retrieving a fresh access token on first load
	// 	try {
	// 		// await refresh({ navigate: false });
	// 	} catch {
	// 		// Ignore error
	// 	}
	// //}

	// // if (serverStore.info.project === null) {
	// // try {
	// // 	await Promise.all(appLifecycleRegistry.initialize.map((initializeCallback) => initializeCallback()));
	// // } catch (error: any) {
	// // 	appStore.error = error;
	// // }
	// // }

	// if (to.meta?.public !== true) {
	// 	if (appStore.initialized === false) {
	// 		appStore.initializing = false;

	// 		if (appStore.authenticated === true) {
	// 			await initialize();

	// 			if (
	// 				userStore.currentUser &&
	// 				to.fullPath === '/tfa-setup' &&
	// 				!('share' in userStore.currentUser) &&
	// 				userStore.currentUser.tfa_secret !== null
	// 			) {
	// 				return userStore.currentUser.last_page || '/login';
	// 			}

	// 			return to.fullPath;
	// 		} else {
	// 			if (to.fullPath) {
	// 				//return '/login?redirect=' + encodeURIComponent(to.fullPath);
	// 			} else {
	// 				//return '/login';
	// 			}
	// 		}
	// 	}

	// 	if (userStore.currentUser && !('share' in userStore.currentUser) && userStore.currentUser.role) {
	// 		if (to.path !== '/tfa-setup') {
	// 			if (userStore.currentUser.role.enforce_tfa && userStore.currentUser.tfa_secret === null) {
	// 				if (userStore.currentUser.last_page === to.fullPath) {
	// 					return '/tfa-setup';
	// 				} else {
	// 					return '/tfa-setup?redirect=' + encodeURIComponent(to.fullPath);
	// 				}
	// 			}
	// 		} else if (userStore.currentUser.tfa_secret !== null) {
	// 			//return userStore.currentUser.last_page || '/login';
	// 		}
	// 	}
	// }

	return;
};

let trackTimeout: number | null = null;

export const onAfterEach: NavigationHookAfter = (to) => {
	const userStore = useUserStore();

	if (to.meta.public !== true && to.meta.track !== false) {
		// The timeout gives the page some breathing room to load. No need to clog up the thread with
		// this call while more important things are loading

		if (trackTimeout) {
			window.clearTimeout(trackTimeout);
			trackTimeout = null;
		}

		trackTimeout = window.setTimeout(() => {
			userStore.trackPage(to);
		}, 500);
	}
};

router.beforeEach(onBeforeEach);
router.afterEach(onAfterEach);
