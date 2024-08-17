<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { SelectOption } from 'vuestic-ui'
import type { User } from "@owl-app/lib-contracts";

const props = defineProps<{
  user?: User | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', project: User): void
  (event: 'close'): void
}>()

const defaultNewProject: User = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: ''
}

const newUser = ref({ ...defaultNewProject })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newUser.value[key as keyof User] !== (props.user ?? defaultNewProject)?.[key as keyof User]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  () => {
    if (!props.user) {
      return
    }

    newUser.value = {
      ...props.user,
    }
  },
  { immediate: true },
)

const required = (v: string | SelectOption) => !!v || 'This field is required'
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newUser.email" label="email" :rules="[required]" />
    <VaInput v-model="newUser.password" label="password" :rules="[required]" />
    <VaInput v-model="newUser.firstName" label="firstName" :rules="[required]" />
    <VaInput v-model="newUser.lastName" label="lastName" :rules="[required]" />
    <VaInput v-model="newUser.phoneNumber" label="phoneNumber" :rules="[required]" />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newUser as User)">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
