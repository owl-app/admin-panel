import { User } from '@owl-app/lib-contracts';

import api, { RequestConfig } from '../services/api';
import { userName } from '../utils/user-name';
import { merge } from 'lodash';
import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { useAppStore } from './app';
import { useLocalStorage } from '@vueuse/core';

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    authenticated: false as boolean,
    accessTokenExpiry: useLocalStorage<number>('accessTokenExpiry', 0),
    refreshTokenExpiry: useLocalStorage<number>('refreshTokenExpiry', 0),
    currentUser: null as User | null,
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
    },
  },
  actions: {
    async hydrate() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/user/me`);

        this.currentUser = data.user;
      } catch (error: any) {
        this.error = error;
        this.accessTokenExpiry = 0;
      } finally {
        this.loading = false;
      }
    },
    async dehydrate() {
      this.$reset();
    },
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post('/auth/login', { email, password });

        this.authenticated = true;
        this.accessTokenExpiry = (Date.now() + (data.accessTokenExpires ?? 0) * 1000);
        this.refreshTokenExpiry = (Date.now() + (data.refreshTokenExpires ?? 0) * 1000);
      } catch (error: any) {
        throw error.response?.data?.message ?? error.message;
      } finally {
        this.loading = false;
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
    async refresh() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post('/auth/refresh');

        this.authenticated = true;
        this.accessTokenExpiry = (Date.now() + (data.accessTokenExpires ?? 0) * 1000);
        this.refreshTokenExpiry = (Date.now() + (data.refreshTokenExpires ?? 0) * 1000);
      } catch (error: any) {
        this.error = error.response.data.message;
      } finally {
        this.loading = false;
      }
    }
  },
});
