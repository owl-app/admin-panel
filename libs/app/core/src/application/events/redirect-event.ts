import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "../contants";
import { defineRequestEvent } from "../defines/events";
import { useAppStore } from "../../stores/app";

export default defineRequestEvent({
	name: 'redirect-event',
    priority: -999,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('run initialize redirect', to)
        const appStore = useAppStore();

        if(to.name === 'login' && to.name !== from.name && appStore.authenticated) {
            next({ path: '/dashboard' })
        } else if (to.meta?.public !== true && !appStore.authenticated && to.matched.length > 0) {
            next({ path: '/login', query: {redirect: encodeURIComponent(to.fullPath)} })
        } else {
            next();
        }
	}
})
	