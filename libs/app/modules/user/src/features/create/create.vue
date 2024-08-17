<template>
  <VaButton
    preset="primary"
    size="small"
    color="primary"
    icon="mso-visibility"
    aria-label="Edit project"
    @click="showModal = !showModal"
  />
  <VaModal
    v-model="showModal"
    ok-text="Apply"
  >
    <h3 class="va-h5">
      Title
    </h3>
    <p>
      Classic modal overlay which represents a dialog box or other interactive
      component, such as a dismissible alert, sub-window, etc.
    </p>
  </VaModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false)
</script>
