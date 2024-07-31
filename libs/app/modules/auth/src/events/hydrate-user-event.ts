import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "@owl-app/lib-app-core/application/contants";
import { defineRequestEvent } from "@owl-app/lib-app-core/application/defines/events";
import { useUserStore } from "@owl-app/lib-app-core/stores/user";
import { useAppStore } from "@owl-app/lib-app-core/stores/app";

export default defineRequestEvent({
	name: 'hydrate-user-event',
    priority: 550,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('hydrate user event')
    const userStore = useUserStore();

    if(!userStore.currentUser && Date.now() < userStore.accessTokenExpiry)
      try {
        await userStore.hydrate();
      } catch {
        // Ignore error
      }
	  }
})
	