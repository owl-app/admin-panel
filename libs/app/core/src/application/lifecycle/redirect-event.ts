import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { LIFECYCLE_EVENTS } from "../contants";
import { defineRequestEvent } from "../defines/events";
import { useAppStore } from "../../stores/app";
import { useUserStore } from "../../stores/user";
import { getCurrentLanguage } from "../lang/get-current-language";
import { setLanguage } from "../lang/set-language";

import { RouteLocationRaw } from "vue-router";

export default defineRequestEvent({
	name: 'redirect-event',
    priority: 800,
    event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
    callback: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
		console.log('run initialize language', to)
        const appStore = useAppStore();
        const userStore = useUserStore();

        console.log('to.meta?.public', to)

        if (to.meta?.public !== true && !appStore.authenticated && to.matched.length > 0) {
            console.log('BBBBBBBBBBBBBBBBBB')
            console.log(to)
            next({ path: '/login', query: {redirect: encodeURIComponent(to.fullPath)} })
        } else {
            console.log('AAAAAAAAAAAAAAAAAA')
            next();
        }

        if (to.meta?.public !== true) {
            if (appStore.initialized === false) {
                appStore.initializing = false;

                if (appStore.authenticated === true) {
                    if (
                        userStore.currentUser &&
                        to.fullPath === '/tfa-setup' &&
                        !('share' in userStore.currentUser) &&
                        userStore.currentUser.tfa_secret !== null
                    ) {
                        return userStore.currentUser.last_page || '/login';
                    }

                    next({ path: to.fullPath });
                } else {
                    if (to.fullPath) {
                        //return '/login?redirect=' + encodeURIComponent(to.fullPath);
                    } else {
                        //return '/login';
                    }
                }
            }

            if (userStore.currentUser && !('share' in userStore.currentUser) && userStore.currentUser.role) {
                if (to.path !== '/tfa-setup') {
                    if (userStore.currentUser.role.enforce_tfa && userStore.currentUser.tfa_secret === null) {
                        if (userStore.currentUser.last_page === to.fullPath) {
                            //return '/tfa-setup';
                        } else {
                            //return '/tfa-setup?redirect=' + encodeURIComponent(to.fullPath);
                        }
                    }
                } else if (userStore.currentUser.tfa_secret !== null) {
                    return userStore.currentUser.last_page || '/login';
                }
            }
        }
	}
})
	