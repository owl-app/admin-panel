<template>
  <owl-form
    collection="clients"
    :class-form="`flex mb-4 bg-white p-3 ${hoverForm ? 'hovered' : ''}`"
    :default-value="defaultValue"
    @saved="$emit('saved', $event)"
    @mouseover="hoverForm = true"
    @mouseleave="hoverForm = false"
  >
    <template #fields="{ data }">
      {{ data }}
      <div class="flex flex-col justify-center">
        <va-icon
          class="material-symbols-outlined cursor-pointer"
          name="handyman"
          :size="18"
          :color="iconColorManual"
          @click="isManual = true"
        />
        <va-icon
          class="material-symbols-outlined cursor-pointer mt-1"
          name="timer"
          :size="18"
          :color="iconColorTimer"
          @click="isManual = false"
        />
      </div>
      <div class="flex-1 pl-4 pr-4">
        <div class="flex space-x-4">
        <va-input
          label=""
          placeholder="What are you working on ?"
          v-model="data.ref.name"
          background="#fff"
        />
        <va-input v-model="inputTimeValue" ref="inputTime" placeholder="00:00:00" />
        <va-time-input
          class="w-24"
          v-model="data.ref.timeFrom"
          manual-input
        />
        <va-time-input
          class="w-24"
          v-model="data.ref.timeTo"
          manual-input
        />
        </div>
      </div>
    </template>

    <template #actions="{ save, data }">
      <div class="flex justify-end flex-col-reverse sm:flex-row min-w-10">
        <va-button v-if="isManual" @click="save()" class="w-full">START</va-button>
        <va-button v-if="!isManual" @click="saveManual();" class="w-full">ADD</va-button>
      </div>
    </template>
  </owl-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInputMask, createRegexMask } from 'vuestic-ui'
import { useLocalStorage } from '@vueuse/core';

import OwlForm from '@owl-app/lib-app-core/components/form/form.vue';
import { Client } from '@owl-app/lib-contracts';

const emit = defineEmits<{
  (event: 'saved', clientSaved: Client): void
}>()

const hoverForm = ref(false);
const inputTimeValue = ref('00:00:00')
const inputTime = ref()

const defaultValue = {
  timeFrom: new Date(),
  timeTo:  new Date(),
}

const isManual = useLocalStorage('time-is-manual', false);

const iconColorManual = computed(() => isManual.value ? 'primary' : 'secondary');
const iconColorTimer = computed(() => isManual.value ? 'secondary' : 'primary');
useInputMask(createRegexMask(/(\d){2}:(\d){2}:(\d){2}/), inputTime)

</script>

<style lang="scss" scoped>
:deep() {
  --va-input-wrapper-horizontal-padding: 0.6rem;
  --va-input-wrapper-border-color-hover: transparent;

  .va-form {
    .va-input-wrapper {
      --va-input-wrapper-border-color: var(--va-input-wrapper-border-color-hover);

      &--focused {
        --va-input-wrapper-border-color: var(--va-input-wrapper-color);

        &__field {
          padding: 10rem var(--va-input-wrapper-horizontal-padding);
        }
      }

      &__field {
        padding: 0.6rem var(--va-input-wrapper-horizontal-padding);
      }
    }

    &.hovered {
      .va-input-wrapper {
        --va-input-wrapper-border-color: var(--va-background-border);
      }
    }
  }
}
</style>