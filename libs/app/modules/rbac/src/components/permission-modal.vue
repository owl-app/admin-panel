<template>
  <VaModal
    v-model="model"
    ok-text="Apply"
    hide-default-actions
  >
  <template #header>
    <header-bar
      :title="(permission ? 'Edit' : 'Create') + ' permission'"
      :icon="permission ? 'edit' : 'add'"
      :bordered-bottom="true"
    />
  </template>
  <template #default="{ ok, cancel}">
    <owl-form
      class-form="flex flex-col gap-2"
      collection="rbac/permissions"
      :primaryKey="permission?.name"
      :schema="validationSchema"
      @saved="ok(); $emit('saved');"
    >
      <template #fields="{ data, validation }">
        <div class="grid grid-cols-1">
          <va-textarea 
            v-model="data.description"
            name="description"
            label="Description"
            min-rows="5"
            :error="!!validation['description']"
            :error-messages="validation['description']"
            :required-mark="true"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <refer-select
            v-model="data.refer"
            :disabled="!isEmpty(data.createdAt)"
            name="refer"
            :error="!!validation['refer']"
            :error-messages="validation['refer']"
            :required-mark="true"
          />
          <collection-select
            v-model="data.collection"
            :disabled="!isEmpty(data.createdAt)"
            name="collection"
            :error="!!validation['collection']"
            :error-messages="validation['collection']"
            :required-mark="true"
          />
        </div>
        <va-input
          v-model="data.name"
          :disabled="!isEmpty(data.createdAt)"
          label="Canonical name"
          name="name"
          :error="!!validation['name']"
          :error-messages="validation['name']"
          :required-mark="true"
        />
      </template>

      <template #actions="{ validate, save, isLoading, isValid }">
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
          <va-button :disabled="isLoading" preset="secondary" color="secondary" @click="cancel">Cancel</va-button>
          <va-button @click="validate(true) && save()">Save</va-button>
        </div>
      </template>
    </owl-form>
  </template>
  </VaModal>
</template>
  
<script setup lang="ts">
import { toRefs } from 'vue';
import * as v from 'valibot'
import { isEmpty } from 'lodash';

import type { Permission } from "@owl-app/lib-contracts";
import OwlForm from '@owl-app/lib-app-core/components/form/form.vue'
import HeaderBar from '@owl-app/lib-app-core/layouts/panel/components/header-bar.vue'

import CollectionSelect from './form/collection-select.vue';
import ReferSelect from './form/refer-select.vue';

const model = defineModel<boolean>();

const emit = defineEmits<{
  (event: 'saved'): void
}>()

const props = defineProps<{
  permission?: Permission | null;
}>();

const { permission } = toRefs(props);

const validationSchema = v.object({
  description: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('The string should contain at least one character')
    ), ''),
  name: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('The string should contain at least one character')
    ), ''),
  refer: v.optional(
  v.pipe(
    v.string(),
    v.nonEmpty('Please select option')
  ), ''),
  collection: v.optional(
  v.pipe(
    v.string(),
    v.nonEmpty('Please select option')
  ), '')
});
</script>
  