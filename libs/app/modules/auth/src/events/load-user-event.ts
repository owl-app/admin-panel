import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "@owl-app/lib-app-core/application/contants";
import { defineRequestEvent } from "@owl-app/lib-app-core/application/defines/events";

let firstLoad = true;

export default defineRequestEvent({
	name: 'load-user-event',
    priority: 550,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('load user event')
	}
})
	