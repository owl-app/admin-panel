<template>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="model"
    ok-text="Apply"
    hide-default-actions
    @beforeOpen="beforeOpen"
  >
    <h3 class="va-h5">
      Title
    </h3>
    <user-form
      :user="item"
      save-button-label="Save"
      @close="cancel"
      @save="
          (user) => {
            onProjectSaved(user)
            ok()
          }
      "
    />
  </VaModal>
</template>

<script setup lang="ts">
import { ref, toRefs, defineEmits } from 'vue';
import { useToast } from 'vuestic-ui'
import type { User } from "@owl-app/lib-contracts";
import { useItem } from '@owl-app/lib-app-core/composables/use-item'
import UserForm from './user-form.vue';

const model = defineModel();

const props = defineProps<{
	user?: User ;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const { user } = toRefs(props);
const { item, loading, getItem, createItem, updateItem } = useItem(`users`);
const { init: notify } = useToast()

function beforeOpen() {
  if(user.value) {
    getItem(user.value.id)
  } else {
    item.value = {}
  }
}

const onProjectSaved = async (user: User) => {
  if(user.id !== undefined) {
    delete user.id
    await updateItem(item.value.id, user);
  } else {
    delete user.id
    await createItem(user)
  }

  model.value = false;

  notify({
    message: 'Project saved',
    color: 'success',
  })
}

</script>
