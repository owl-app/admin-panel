import { orderBy } from 'lodash';
import {
  createRouter,
  createWebHistory,
  NavigationGuard,
  NavigationHookAfter,
} from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { useUserStore } from '../stores/user';
import { getRootPath } from '../utils/get-root-path';
import PrivateNotFound from '../pages/private-not-found.vue';

import { useAppLifecycleEventRegistry } from './registry';
import { LIFECYCLE_EVENTS } from './contants';
import Dashboard from '../pages/dashboard/dashboard.vue';

export const defaultRoutes: RouteRecordRaw[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: Dashboard,
  },
  {
    name: 'private-404',
    path: '/:_(.+)+',
    component: PrivateNotFound,
  },
];

export const router = createRouter({
  history: createWebHistory(getRootPath()+ 'admin/'),
  routes: defaultRoutes,
});

export const onBeforeEach: NavigationGuard = async (to, from, next) => {
  const appLifecycleEventRegistry = useAppLifecycleEventRegistry();

  await orderBy(appLifecycleEventRegistry.request, ['priority'], 'desc')
    .filter(({ event }) => event === LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH)
    .reduce(async (prviousEvent, event) => {
      await prviousEvent;
      await event.callback(to, from, next);
    }, Promise.resolve());
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
