import api, { RequestConfig } from '../services/api';
import { userName } from '../utils/user-name';
import { User } from '@owl-app/lib-contracts';
import { merge } from 'lodash';
import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { useAppStore } from './app';

type ShareUser = {
	share: string;
	role: {
		id: string;
		admin_access: false;
		app_access: false;
	};
};

export const useUserStore = defineStore({
	id: 'userStore',
	state: () => ({
		currentUser: null as User | ShareUser | null,
		loading: false,
		error: null,
	}),
	getters: {
		fullName(): string | null {
			if (this.currentUser === null || 'share' in this.currentUser) return null;
			return userName(this.currentUser);
		},
		isAdmin(): boolean {
			return true;
			// return this.currentUser?.role?.admin_access === true || false;
		},
		isPublic(): boolean {
			return true;
		}
	},
	actions: {
		async hydrate() {
			this.loading = true;

			try {
				console.log('try loging')

				const { data } = await api.get(`/users/me`);

				this.currentUser = data.data;
			} catch (error: any) {
				this.error = error;
			} finally {
				this.loading = false;
			}
		},
		async dehydrate() {
			this.$reset();
		},
		async hydrateAdditionalFields(fields: string[]) {
			try {
				const { data } = await api.get(`/users/me`, { params: { fields } });

				this.currentUser = merge({}, this.currentUser, data.data);
			} catch (error: any) {
				// Do nothing
			}
		},
		async trackPage(to: RouteLocationNormalized) {
			/**
			 * We don't want to track the full screen preview from live previews as part of the user's
			 * last page, as that'll cause a fresh login to navigate to the full screen preview where
			 * you can't navigate away from #19160
			 */
			if (to.path.endsWith('/preview')) {
				return;
			}

			// await api.patch(
			// 	`/users/me/track/page`,
			// 	{
			// 		last_page: to.fullPath,
			// 	},
			// 	{ measureLatency: true } as RequestConfig,
			// );

			if (this.currentUser && !('share' in this.currentUser)) {
				// this.currentUser.last_page = to.fullPath;
			}
		},
		async login(email: string, password: string) {
			const appStore = useAppStore()
			try {
				const { data } = await api.post('/auth/login', { email, password });

				this.currentUser = data.data;
				appStore.authenticated = true;
			} catch (error: any) {
				this.error = error.response.data.message;
			}
		}
	},
});
