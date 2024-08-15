import axios from 'axios';
import { isEqual, throttle } from 'lodash-es';
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import { computed, ref, unref, watch } from 'vue';

import type { Item, Query } from '../types';
import api from '../../../services/api';

export type ManualSortData = {
  item: string | number;
  to: string | number;
};

export type UsableItems = {
  totalCount: Ref<number | null>;
  items: Ref<Record<string, any>[]>;
  totalPages: ComputedRef<number>;
  loading: Ref<boolean>;
  error: Ref<any>;
  getItems: () => Promise<void>;
};

export type ComputedQuery = {
  limit:
    | Ref<Query['limit']>
    | WritableComputedRef<Query['limit']>;
  sort:
    | Ref<Query['sort']>
    | WritableComputedRef<Query['sort']>;
  filter:
    | Ref<Query['filter']>
    | WritableComputedRef<Query['filter']>;
  page: 
    | Ref<Query['page']> 
    | WritableComputedRef<Query['page']>;
  deep?:
    | Ref<Query['deep']>
    | WritableComputedRef<Query['deep']>;
};

export function useItems(
  url: string,
  query: ComputedQuery
): UsableItems {
  const {
    limit,
    sort,
    filter,
    page,
    deep: queryDeep,
  } = query;

  const deep = queryDeep ?? ref();

  const items = ref<Item[]>([]);
  const loading = ref(false);
  const error = ref<any>(null);

  const totalCount = ref<number | null>(null);

  const totalPages = computed(() => {
    if (totalCount.value === null) return 1;
    if (totalCount.value < (unref(limit) ?? 100)) return 1;
    return Math.ceil(totalCount.value / (unref(limit) ?? 100));
  });

  const existingRequests: Record<
    'items' | 'total' | 'filter',
    AbortController | null
  > = {
    items: null,
    total: null,
    filter: null,
  };

  let loadingTimeout: NodeJS.Timeout | null = null;

  const fetchItems = throttle(getItems, 500);

  watch(
    [limit, sort, filter, page, deep],
    async (after, before) => {
      if (isEqual(after, before)) return;

      const [newLimit, newSort, newFilter] = after;
      const [oldLimit, oldSort, oldFilter] = before;

      if (
        !isEqual(newFilter, oldFilter) ||
        !isEqual(newSort, oldSort) ||
        newLimit !== oldLimit
      ) {
        page.value = 1;
      }

      fetchItems();
    },
    { deep: true, immediate: true }
  );

  return {
    items,
    totalCount,
    totalPages,
    loading,
    error,
    getItems,
  };

  async function getItems() {
    let isCurrentRequestCanceled = false;

    if (existingRequests.items) existingRequests.items.abort();
    existingRequests.items = new AbortController();

    error.value = null;

    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    loadingTimeout = setTimeout(() => {
      loading.value = true;
    }, 150);

    try {
      const response = await api.get<any>(url, {
        params: {
          limit: unref(limit),
          sort: unref(sort),
          page: unref(page),
          deep: unref(deep),
          ...unref(filter)
        },
        signal: existingRequests.items.signal,
      });

      const fetchedItems = response.data.items;
      existingRequests.items = null;

      totalCount.value = response.data.metadata.total;

      items.value = fetchedItems;

      if (page && fetchedItems.length === 0 && page?.value !== 1) {
        page.value = 1;
      }
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
