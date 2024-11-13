<template>
  <owl-form
      class-form="flex flex-col gap-2"
      collection="user"
      action="profile"
      :schema="profileUserValidationSchema"
      @saved="ok(); $emit('saved');"
  >
    <template #fields="{ data, validation }">
      {{ validation }}
      <va-input
        v-model="data.ref.firstName"
        label="firstName"
        name="firstName"
        :error="!!validation['firstName']"
        :error-messages="validation['firstName']"
      />
      <va-input
        v-model="data.ref.lastName"
        label="lastName"
        name="lastName"
        :error="!!validation['lastName']"
        :error-messages="validation['lastName']"
      />
      <va-input
        v-model="data.ref.phoneNumber"
        label="phoneNumber"
        name="phoneNumber"
        :error="!!validation['phoneNumber']"
        :error-messages="validation['phoneNumber']"
      />
      <va-input 
        v-model="data.ref.passwordNew"
        label="Password"
        name="passwordNew"
        :error="!!validation['passwordNew']"
        :error-messages="validation['passwordNew']"
        :required-mark="true"
      />
      <va-input 
        v-model="data.ref.passwordNewRepeat"
        label="Password"
        name="passwordNewRepeat"
        :error="!!validation['passwordNewRepeat']"
        :error-messages="validation['passwordNewRepeat']"
        :required-mark="true"
      />
    </template>

    <template #actions="{ save, validate }">
      <div class="flex justify-center flex-col-reverse sm:flex-row mt-4 gap-2">
          <va-button @click="validate(true) && save()">Save changes</va-button>
      </div>
    </template>
  </owl-form>
</template>

<script setup lang="ts">
  import { profileUserValidationSchema } from "@owl-app/lib-contracts";
  import OwlForm from '@owl-app/lib-app-core/components/form/form.vue'
</script>