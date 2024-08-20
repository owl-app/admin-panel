<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useModal } from 'vuestic-ui'

import type { Item, PrimaryKey } from '../../types/item';
import { useItem } from '../../composables/use-item';

const props = defineProps<{
  collection: string,
  primaryKey?: PrimaryKey | undefined,
}>()

const emit = defineEmits<{
  (event: 'deleted'): void
}>()

const showModal = ref(false);

const { init } = useModal()
const { primaryKey, deleting, remove } = useItem<Item>(props.collection, props.primaryKey);

watch(
  () => props.primaryKey,
  async () => {
    if (!props.primaryKey) {
      primaryKey.value = null;
      showModal.value = false;
      return;
    }

    primaryKey.value = props.primaryKey;
    showModal.value = true;
  },
  { immediate: false },
)

const onDelete = async () => {
  await remove();

  emit('deleted');

  showModal.value = false;
}

</script>

<template>
  <VaModal
    v-slot="{ cancel }"
    v-model="showModal"
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
