import axios from 'axios';
import type { Ref } from 'vue';
import { ref} from 'vue';

import api from '../services/api';

export type ManualSortData = {
  item: string | number;
  to: string | number;
};

export type UsableItem = {
  item: Ref<Record<string, any>>;
  loading: Ref<boolean>;
  error: Ref<any>;
  getItem: (id: string | number) => Promise<void>;
  createItem: (data: Record<string, any>) => Promise<void>;
  updateItem: (id: string | number, data: Record<string, any>) => Promise<void>;
};

export function useItem(
  url: string,
): UsableItem {
  const item = ref<Record<string, any>>({});
  const loading = ref(false);
  const error = ref<any>(null);

  const existingRequests: Record<
    'item',
    AbortController | null
  > = {
    item: null,
  };

  let loadingTimeout: NodeJS.Timeout | null = null;

  return {
    item,
    loading,
    error,
    getItem,
    createItem,
    updateItem,
  };

  async function getItem(id: string | number) {
    runAction(async () => {
      const response = await api.get<any>('/' + url + '/' + id);

      const fetchedItem = response.data;
      existingRequests.item = null;

      item.value = fetchedItem;
    })
  }

  async function createItem(data: Record<string, any>) {
    runAction(async () => {
      const response = await api.post<any>('/' + url, data);

      const fetchedItem = response.data;
      existingRequests.item = null;

      item.value = fetchedItem;
    })
  }

  async function updateItem(id: string | number, data: Record<string, any>) {
    runAction(async () => {
      const response = await api.put<any>('/' + url + '/' + id, data);

      const fetchedItem = response.data;
      existingRequests.item = null;

      item.value = fetchedItem;
    })
  }

  async function runAction(action: () => Promise<any>) {
    let isCurrentRequestCanceled = false;

    if (existingRequests.item) existingRequests.item.abort();
    existingRequests.item = new AbortController();

    error.value = null;

    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    loadingTimeout = setTimeout(() => {
      loading.value = true;
    }, 150);

    try {
      await action();
    } catch (err: any) {
      if (axios.isCancel(err)) {
        isCurrentRequestCanceled = true;
      } else {
        error.value = err;
      }
    } finally {
      if (loadingTimeout && !isCurrentRequestCanceled) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }

      if (!loadingTimeout) loading.value = false;
    }
  }
}
