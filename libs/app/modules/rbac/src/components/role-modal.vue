<template>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="model"
    ok-text="Apply"
    hide-default-actions
  >
    <h3 class="va-h5">
      {{ role ? 'Edit' : 'Create' }} role
    </h3>
    <owl-form
      class-form="flex flex-col gap-2"
      collection="rbac/roles"
      :primaryKey="role?.name"
      :default-value="defaultRole"
      @saved="ok(); $emit('saved');"
    >
      <template #fields="{ data }">
        <va-input v-model="data.setting.displayName" label="Display name" />
        <va-input v-model="data.setting.theme" label="Theme" min-rows="5" />
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

const defaultRole: Role = {
  name: '',
  description: '',
  setting: {
    displayName: '',
    theme: ''
  }
}

const emit = defineEmits<{
  (event: 'saved',): void
}>()

const props = defineProps<{
  role?: Role | null;
}>();

const { role } = toRefs(props);
</script>
  