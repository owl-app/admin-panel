<template>
  <auth-layout>
    <div class="w-96">
      <h1 class="font-semibold text-4xl mb-4">Register</h1>
      <owl-form
        collection="auth/register"
        :schema="loginValidationSchema"
        @saved="$emit('registered');"
      >
        <template #fields="{ data, validation }">
          <va-input
            v-model="data.ref.email"
            label="E-mail"
            name="email"
            class="mb-4"
            type="email"
            :error="!!validation['email']"
            :error-messages="validation['email']"
            :required-mark="true"
          />
        </template>

        <template #actions="{ validate, data }">
          <div class="flex justify-center mt-4">
            <va-button class="w-full" :loading="userStore.loading" @click="validate(true) && login(data.value)">Register</va-button>
          </div>
        </template>
      </owl-form>
    </div>
  </auth-layout>
</template>

<script lang="ts" setup>
import { useToast } from 'vuestic-ui'
import { loginValidationSchema } from "@owl-app/lib-contracts";
import { useUserStore } from '@owl-app/lib-app-core/stores/user';
import { router } from '@owl-app/lib-app-core/application/router';
import OwlForm from '@owl-app/lib-app-core/components/form/form.vue'

const userStore = useUserStore()
const { init: notify } = useToast();

const login = async (data: { [x: string]: any; }) => {
  try {
    await userStore.login(data.email, data.password);

    router.push({ path: 'times' });
  } catch (error: any) {
    notify({
      message: error,
      color: 'danger',
      position: 'bottom-right',
      offsetY: 30
    })
  }
}
</script>
