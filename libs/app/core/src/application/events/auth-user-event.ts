import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "../contants";
import { defineRequestEvent } from "../defines/events";
import { useUserStore } from "../../stores/user";

let firstLoad = true;

export default defineRequestEvent({
	name: 'auth-user-event',
    priority: 600,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('auth user event')
    const userStore = useUserStore();

    // refresh token if page reload
    if(firstLoad && Date.now() < userStore.refreshTokenExpiry && !userStore.authenticated) {
      try {
        await userStore.refresh();
      } catch {
        // Ignore error
      } finally {
        firstLoad = false;
      }
    }

    // if (
    //   userStore.refreshTokenExpiry &&
    //   Date.now() < userStore.refreshTokenExpiry
    // ) {
    //   try {
    //     await userStore.refresh();
    //   } catch {
    //     // Ignore error
    //   }
    // }
	}
})
	