<template>
  <auth-layout>
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">Log in</h1>
      <p class="text-base mb-4 leading-5">
        New to Owl?
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Sign up</RouterLink>
      </p>
      <VaInput
        v-model="formData.email"
        :rules="[validators.required, validators.email]"
        class="mb-4"
        label="Email"
        type="email"
      />
      <VaValue v-slot="isPasswordVisible" :default-value="false">
        <VaInput
          v-model="formData.password"
          :rules="[validators.required]"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          label="Password"
          @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
        >
          <template #appendInner>
            <VaIcon
              :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
              class="cursor-pointer"
              color="secondary"
            />
          </template>
        </VaInput>
      </VaValue>

      <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
        <RouterLink :to="{ name: 'recovery-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
          Forgot password?
        </RouterLink>
      </div>

      <div class="flex justify-center mt-4">
        <VaButton class="w-full" @click="submit"> Login</VaButton>
      </div>
    </VaForm>
  </auth-layout>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useUserStore } from '@owl-app/lib-app-core/stores/user';
import { router } from '@owl-app/lib-app-core/application/router';
import { validators } from './utils'

const userStore = useUserStore()
const { validate } = useForm('form')
const { init } = useToast()

const formData = reactive({
  email: '',
  password: '',
}) 

const submit = async () => {
  if (validate()) {
    try {
        await userStore.login(formData.email, formData.password);

        init({ message: 'Success', color: 'success' });

        router.push({ path: 'dashboard' });
    } catch (error: string) {
      init({ message: error, color: 'danger' })
    }
  }
}
</script>
