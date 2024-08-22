<template>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="model"
    ok-text="Apply"
    hide-default-actions
  >
    <h3 class="va-h5">
      {{ permission ? 'Edit' : 'Create' }} permission
    </h3>
    <owl-form
      class-form="flex flex-col gap-2"
      collection="rbac/permissions"
      :primaryKey="permission?.name"
      @saved="ok(); $emit('saved');"
    >
      <template #fields="{ data }">
        <va-textarea v-model="data.description" name="description" label="Description" min-rows="5" />
        <va-input v-model="data.name" :disabled="!isEmpty(data.createdAt)" label="Canonical name" />
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
import { toRefs } from 'vue';
import type { Role } from "@owl-app/lib-contracts";
import OwlForm from '@owl-app/lib-app-core/components/form/form.vue'
import { isEmpty } from 'lodash';

const model = defineModel<boolean>();

const emit = defineEmits<{
  (event: 'saved',): void
}>()

const props = defineProps<{
  permission?: Role | null;
}>();

const { permission } = toRefs(props);
</script>
  