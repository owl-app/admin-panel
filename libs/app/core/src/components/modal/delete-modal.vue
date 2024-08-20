<template>
  <VaModal
    v-slot="{ cancel }"
    v-model="model"
    ok-text="Apply"
    hide-default-actions
    title="Deleting"
  >
    Are you sure you want to delete ?
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <va-button :disabled="deleting" preset="secondary" color="secondary" @click="cancel">Cancel</va-button>
      <va-button :loading="deleting" color="danger" @click="onDelete">Delete</va-button>
    </div>
  </VaModal>
</template>

<script lang="ts" setup>
import { watch, defineModel } from 'vue';

import type { Item, PrimaryKey } from '../../types/item';
import { useItem } from '../../composables/use-item';

const props = defineProps<{
  collection: string,
  primaryKey?: PrimaryKey | undefined,
}>()

const emit = defineEmits<{
  (event: 'deleted'): void
}>()

const model = defineModel<boolean>();

const { primaryKey, deleting, remove } = useItem<Item>(props.collection, props.primaryKey);

watch(
  () => props.primaryKey,
  async () => {
    if (!props.primaryKey) {
      primaryKey.value = null;
      return;
    }

    primaryKey.value = props.primaryKey;
  },
  { immediate: false },
)

const onDelete = async () => {
  await remove();

  emit('deleted');

  model.value = false;
}
</script>
