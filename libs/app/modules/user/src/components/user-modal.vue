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
    <user-form
      :user="user"
      save-button-label="Save"
      @close="cancel"
      @saved="
          () => {
            ok()
          }
      "
    >
    <template #actions="{validate, save}">
      <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
        <VaButton preset="secondary" color="secondary" @click="cancel">Cancel</VaButton>
        <VaButton @click="validate() && save()">Save</VaButton>
      </div>
    </template>
  </user-form>
  </VaModal>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { User } from "@owl-app/lib-contracts";
import UserForm from './user-form.vue';

const model = defineModel<boolean>();

const props = defineProps<{
	user?: User ;
}>();

const { user } = toRefs(props);
</script>
