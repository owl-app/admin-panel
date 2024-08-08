import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "../contants";
import { defineRequestEvent } from "../defines/events";
import { useUserStore } from "../../stores/user";

export default defineRequestEvent({
	name: 'hydrate-user-event',
    priority: 550,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('hydrate user event')
    const userStore = useUserStore();

    if(!userStore.currentUser && userStore.authenticated)
      try {
        await userStore.hydrate();
      } catch {
        // Ignore error
      }
	  }
})
	