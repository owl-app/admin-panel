import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "../contants";
import { defineRequestEvent } from "../defines/events";
import { useAppStore } from "../../stores/app";
import { useUserStore } from "../../stores/user";
import { getCurrentLanguage } from "../lang/get-current-language";
import { setLanguage } from "../lang/set-language";

export default defineRequestEvent({
	name: 'initialize-lang',
    priority: 800,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('run initialize language', to)

		const appStore = useAppStore();
	
		if (!appStore.initializing) return;

		try {

			const lang = getCurrentLanguage();
	
			await setLanguage(lang);

		} catch (error: any) {
			appStore.error = error;
		} finally {
            appStore.initializing = false;
        }
    
        appStore.initialized = true;
	}
})
	