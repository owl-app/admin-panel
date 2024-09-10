import { DateTime } from 'luxon'

import { Time } from '@owl-app/lib-contracts';

import api from '../services/api';
import { defineStore } from 'pinia';

export const useTimeStore = defineStore({
  id: 'timeStore',
  state: () => ({
    active: null as Time | null,
    loading: false,
    intervalTimer: null as ReturnType<typeof setInterval> | null,
    timer: '00:00:00',
  }),
  actions: {
    async hydrate() {
      this.loading = true;

      try {
        const { data } = await api.get(`/user/me`);
      } finally {
        this.loading = false;
      }
    },
    async dehydrate() {
      this.$reset();
    },
    async stopWatch() {
      this.loading = true;

      try {
        const { data } = await api.post('/auth/login');

      } catch (error: any) {
        throw error.response?.data?.message ?? error.message;
      } finally {
        this.loading = false;
      }
    },
    async startTimer() {
      const startTime = DateTime.now();

      this.timer = '00:00:00';

      this.intervalTimer = setInterval(() => {
        const now = DateTime.now();
    
        this.timer = now
          .diff(startTime, ["hours", "minutes", "seconds"])
          .toFormat('hh:mm:ss');
      }, 1000);
    },
    async stopTimer() {
      if(this.intervalTimer) {
        clearInterval(this.intervalTimer);
        this.intervalTimer = null;
        this.timer = '00:00:00';
      }
    }
  },
});
