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
      :schema="roleValidationSchema"
      @saved="ok(); $emit('saved');"
    >
      <template #fields="{ data, validation }">
        <va-input
          v-model="data.ref.setting.displayName"
          label="Display name"
          name="setting.displayName"
          :error="!!validation['setting.displayName']"
          :error-messages="validation['setting.displayName']"
          :required-mark="true"
        />
        <va-input 
          v-model="data.name"
          :disabled="!isEmpty(data.ref.createdAt)"
          label="Canonical name"
          name="name"
          :error="!!validation['name']"
          :error-messages="validation['name']"
          :required-mark="true"
        />
        <collection-select
            v-model="data.ref.collection"
            :disabled="!isEmpty(data.ref.createdAt)"
            name="collection"
            :error="!!validation['collection']"
            :error-messages="validation['collection']"
            :required-mark="true"
        />
        <va-textarea 
          v-model="data.ref.description"
          label="Description"
          min-rows="5"
          name="description"
          :error="!!validation['description']"
          :error-messages="validation['description']"
          :required-mark="true"
        />
        <va-input
          v-model="data.ref.setting.theme"
          label="Theme"
          min-rows="5"
        />
      </template>

      <template #actions="{ validate, save, isLoading, isValid }">
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
          <va-button :disabled="isLoading" preset="secondary" color="secondary" @click="cancel">Cancel</va-button>
          <va-button @click="validate(true) && save()">Save</va-button>
        </div>
      </template>
    </owl-form>
  </VaModal>
</template>
  
<script setup lang="ts">
import { toRefs } from 'vue';
import { isEmpty } from 'lodash';

import { type Role, roleValidationSchema } from "@owl-app/lib-contracts";
import OwlForm from '@owl-app/lib-app-core/components/form/form.vue'

import CollectionSelect from './form/collection-select.vue';

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
  