<template>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="model"
    ok-text="Apply"
    hide-default-actions
  >
    <h3 class="va-h5">
      {{ item ? 'Edit' : 'Create' }} client
    </h3>
    <owl-form
      class-form="flex flex-col gap-2"
      collection="clients"
      :primaryKey="item?.id"
      @saved="ok(); $emit('saved');"
    >
      <template #fields="{ data }">
        <va-input v-model="data.ref.name" label="name" />
        <va-input v-model="data.ref.email" label="email" />
        <va-textarea v-model="data.ref.addess" label="address" min-rows="5" />
        <va-textarea v-model="data.ref.description" label="description" min-rows="5" />
      </template>

      <template #actions="{ validate, save, isLoading, isValid }">
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
          <va-button :disabled="isLoading" preset="secondary" color="secondary" @click="cancel">Cancel</va-button>
          <va-button :disabled="!isValid" @click="validate() && save()">Save</va-button>
        </div>
      </template>
    </owl-form>
  </VaModal>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import type { Client } from "@owl-app/lib-contracts";
import OwlForm from '@owl-app/lib-app-core/components/form/form.vue'

const model = defineModel<boolean>();

const emit = defineEmits<{
  (event: 'saved',): void
}>()

defineExpose({
  show,
})

const item = ref<any>({})

function show(data: any = {}): void {
  model.value = true;
  item.value = data;
}
</script>
  