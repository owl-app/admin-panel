<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'

import type { Item, PrimaryKey } from '../../types/item';
import { useItem } from '../../composables/use-item';

const props = defineProps<{
  collection: string,
  primaryKey?: PrimaryKey | undefined,
  defaultValue?: Item | null,
  classForm?: string,
}>()

const emit = defineEmits<{
  (event: 'saved', dataSaved: any): void
}>()

const dataForm = ref({ ...props.defaultValue ?? {} })
const { primaryKey, item, loading, saving, getItem, save } = useItem<Item>(props.collection, props.primaryKey);
const { isValid } = useForm('form')

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(dataForm.value).some((key) => {
    return (
      dataForm.value[key as keyof Item] !== (item.value ?? props.defaultValue)?.[key as keyof Item]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.primaryKey,
  async () => {
    if (!props.primaryKey) {
      primaryKey.value = null;
      return;
    }

    primaryKey.value = props.primaryKey;
    await getItem();

    dataForm.value = {
      ...item.value,
    }
  },
  { immediate: true },
)

const saveForm = async () => {
  delete dataForm.value?.id
  const savedData = await save(dataForm.value);
  dataForm.value = {}
  emit('saved', savedData);
}

</script>

<template>
  <VaInnerLoading :loading="loading || saving">
    <va-form 
      ref="form"
      v-slot="{ validate }"
      :class="classForm"
    >
      
      <slot name="fields" :data="dataForm"></slot>
      <slot
        name="actions"
        :validate="validate"
        :save="saveForm"
        :is-valid="isValid"
        :is-loading="loading || saving"
        :data="dataForm"
      />
    </va-form>
  </VaInnerLoading>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
