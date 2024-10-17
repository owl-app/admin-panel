import type { ComputedRef, Ref } from 'vue';
import { computed, ref} from 'vue';
import { useToast } from 'vuestic-ui/web-components';

import { isEmpty } from '@owl-app/utils';

import api from '../services/api';
import { Item, PrimaryKey } from '../types/item';
import { i18n } from '../application/lang';
import { delay } from '../utils/delay';

export type ManualSortData = {
  item: string | number;
  to: string | number;
};

export type UsableItem<T extends Item> = {
  primaryKey: Ref<PrimaryKey | undefined | null>;
  item: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<any>;
  getItem: () => Promise<void>;
  isNew: ComputedRef<boolean>;
  saving: Ref<boolean>;
  save: (data: T) => Promise<T>;
  deleting: Ref<boolean>;
  remove: () => Promise<void>;
  validationServerErrors: Ref<any>;
};

export function useItem<T extends Item>(
  //change to collection like in directus with permissions
  collection: string,
  id?: PrimaryKey | undefined,
): UsableItem<T> {
  const { init: notify } = useToast();

  const item: Ref<T | null> = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref<any>(null);
  const validationServerErrors = ref<any>({});
  const primaryKey = ref<PrimaryKey | undefined | null>(id ?? null);
  const isNew = computed(() =>  isEmpty(primaryKey.value));

  const endpoint = computed(() => {
    if (isNew.value) {
      return collection;
    }

    return `${collection}/${encodeURIComponent(primaryKey.value as string)}`;
  });

  return {
    primaryKey,
    item,
    loading,
    error,
    getItem,
    isNew,
    saving,
    save,
    deleting,
    remove,
    validationServerErrors,
  };

  async function getItem() {
    loading.value = true;
    error.value = null;

    try {
      await delay(500);
      const response = await api.get(endpoint.value);
      item.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function save(data: T) {
    saving.value = true;

    try {
      await delay(500);
      let response;

      if (isNew.value) {
        response = await api.post(endpoint.value, data);

        notify({
          message: i18n.global.t('item_create_success', 1),
          color: 'success',
          position: 'bottom-right',
          offsetY: 30
        })
      } else {
        response = await api.put(endpoint.value, data);

        notify({
          message: i18n.global.t('item_update_success', 1),
          color: 'success',
          position: 'bottom-right',
          offsetY: 30
        })
      }

      item.value = response.data;
      validationServerErrors.value = {};

      return response.data;
    } catch (error) {
      saveErrorHandler(error);
    } finally {
      saving.value = false;
    }
  }

  async function remove() {
    deleting.value = true;

    try {
      await delay(500);
      await api.delete(endpoint.value);

      item.value = null;

      notify({
        message: i18n.global.t('item_delete_success', 1),
        color: 'success',
        position: 'bottom-right',
        offsetY: 30
      })
    } catch (errorResponse) {
      error.value = errorResponse;
      throw errorResponse;
    } finally {
      deleting.value = false;
    }
  }

  function saveErrorHandler(error: any) {
    if (error?.response?.data?.errors) {
      validationServerErrors.value = error.response.data.errors
    }
  }
}