<template>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="model"
    ok-text="Apply"
    hide-default-actions
  >
    <h3 class="va-h5">
      {{ user ? 'Edit' : 'Create' }} User
    </h3>
    <owl-form collection="users" :primaryKey="user?.id" @saved="ok(); $emit('saved');" >
      <template #fields="{ data }">
        <va-input v-model="data.email" label="email" :rules="[required]" />
        <va-input v-model="data.password" label="password" />
        <va-input v-model="data.firstName" label="firstName" :rules="[required]" />
        <va-input v-model="data.lastName" label="lastName" :rules="[required]" />
        <va-input v-model="data.phoneNumber" label="phoneNumber" :rules="[required]" />
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
import type { User } from "@owl-app/lib-contracts";
import OwlForm from '@owl-app/lib-app-core/components/form/form.vue'

const model = defineModel<boolean>();

const emit = defineEmits<{
  (event: 'saved',): void
}>()

const props = defineProps<{
	user?: User | null;
}>();

const { user } = toRefs(props);

const required = (v: string) => !!v || 'This field is required'
</script>
