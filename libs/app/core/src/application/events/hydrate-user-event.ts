import { LIFECYCLE_EVENTS } from "../contants";
import { defineRequestEvent } from "../defines/events";
import { useUserStore } from "../../stores/user";

export default defineRequestEvent({
	name: 'hydrate-user-event',
    priority: 550,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (): Promise<void> => {
    const userStore = useUserStore();

    if(!userStore.currentUser && userStore.authenticated)
      try {
        await userStore.hydrate();
      } catch {
        // Ignore error
      }
	  }
})
	