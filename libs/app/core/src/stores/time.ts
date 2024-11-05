import { DateTime } from 'luxon'
import { debounce } from 'lodash';

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
        const { data } = await api.get(`/times/in-progress`);

        if (data) {
          this.active = data;
          this.startInterval();
        }

      } finally {
        debounce(() => {
          this.loading = false;
        }, 500)();
      }
    },
    async dehydrate() {
      this.$reset();
    },
    async startTimer(description: string, tags: string[]) {
      try {
        this.startInterval();

        const { data }  = await api.post('/times/stopwatch', {
          description,
          tags,
        });

        this.active = data;

      } catch (error: any) {
        throw error.response?.data?.message ?? error.message;
      }
    },

    async continueTimer(id: string) {
      try {
        const { data }  = await api.post(`/times/stopwatch/${id}`);

        this.active = data;

        this.startInterval();
      } catch (error: any) {
        throw error.response?.data?.message ?? error.message;
      }
    },

    async stopTimer(description: string, tags: string[]) {
      try {
        const { data } = await api.put('/times/stopwatch', {
          description,
          tags,
        });

        this.active = null;
        this.stopInterval();

        return data;
      } catch (error: any) {
        throw error.response?.data?.message ?? error.message;
      }
    },

    startInterval() {
      const startTime = DateTime.fromJSDate(new Date(this.active?.timeIntervalStart ||  new Date()));

      this.timer = '00:00:00';

      this.intervalTimer = setInterval(() => {
        const now = DateTime.now();
    
        this.timer = now
          .diff(startTime, ["hours", "minutes", "seconds"])
          .toFormat('hh:mm:ss');
      }, 1000);
    },

    stopInterval() {
      if(this.intervalTimer) {
        clearInterval(this.intervalTimer);
        this.intervalTimer = null;
        this.timer = '00:00:00';
      }
    }
  },
});
