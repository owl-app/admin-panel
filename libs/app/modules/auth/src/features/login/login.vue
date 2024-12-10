<template>
  <auth-layout>
    <div class="w-96">
      <h1 class="font-semibold text-4xl mb-4">Log in</h1>
      <p class="text-base mb-4 leading-5">
        New to Owl?
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Sign up</RouterLink>
      </p>
      <owl-form
        collection="auth/login"
        :schema="loginValidationSchema"
        @saved="$emit('logged');"
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
          <div>
            <va-value v-slot="isPasswordVisible" :default-value="false">
              <va-input
                v-model="data.ref.password"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                label="Password"
                name="password"
                @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
                :error="!!validation['password']"
                :error-messages="validation['password']"
                :required-mark="true"
              >
                <template #appendInner>
                  <VaIcon
                    :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
                    class="cursor-pointer"
                    color="secondary"
                  />
                </template>
              </va-input>
            </va-value>
          </div>
        </template>

        <template #actions="{ validate, data }">
          <div class="auth-layout__options flex flex-col sm:flex-row sm:items-center justify-start">
            <RouterLink :to="{ name: 'register' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
              Register
            </RouterLink>
            <RouterLink :to="{ name: 'recovery-password' }" class="mt-2 sm:mt-0 font-semibold text-primary ml-auto">
              Forgot password?
            </RouterLink>
          </div>
          <div class="flex justify-center mt-4">
            <va-button class="w-full" :loading="userStore.loading" @click="validate(true) && login(data.value)">Login</va-button>
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
