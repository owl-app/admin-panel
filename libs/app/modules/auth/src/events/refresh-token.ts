import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "@owl-app/lib-app-core/application/contants";
import { defineRequestEvent } from "@owl-app/lib-app-core/application/defines/events";
import { useUserStore } from "@owl-app/lib-app-core/stores/user";

export default defineRequestEvent({
	name: 'refresh-token-event',
    priority: 550,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('refresh token event')
    const userStore = useUserStore();

    if (userStore.accessTokenExpiry && Date.now() < userStore.accessTokenExpiry - 1000) {
      // Try retrieving a fresh access token on first load and hydrate user
      try {
        await userStore.refresh();
      } catch {
        // Ignore error
      }
    }
	}
})
	