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

export const onBeforeEach: NavigationGuard = async (to, from) => {
  const appLifecycleEventRegistry = useAppLifecycleEventRegistry();
  let result = null;

  await orderBy(appLifecycleEventRegistry.request, ['priority'], 'desc')
    .filter(({ event }) => event === LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH)
    .reduce(async (prviousEvent, event) => {
      await prviousEvent;
      result = await event.callback(to, from);
    }, Promise.resolve());

  if (result) {
    return result;
  }
};

export const onAfterEach: NavigationHookAfter = async (to, from) => {
  const appLifecycleEventRegistry = useAppLifecycleEventRegistry();
  let result = null;

  await orderBy(appLifecycleEventRegistry.request, ['priority'], 'desc')
    .filter(({ event }) => event === LIFECYCLE_EVENTS.REQUEST.ON_AFTER_EACH)
    .reduce(async (prviousEvent, event) => {
      await prviousEvent;
      result = await event.callback(to, from);
    }, Promise.resolve());

  if (result) {
    return result;
  }
};

router.beforeEach(onBeforeEach);
router.afterEach(onAfterEach);
