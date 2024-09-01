<template>
  <owl-form collection="clients" 
    :class-form="`flex mb-4 bg-white p-3 ${hoverForm ? 'hovered' : ''}`"
    :default-value="defaultValue"
    @saved="$emit('saved', $event)"
    @mouseover="hoverForm = true"
    @mouseleave="hoverForm = false"
  >
    <template #fields="{ data }">
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
          <va-time-input 
            class="w-24"
            v-model="data.ref.timeFrom"
            manual-input
            :parse="(value: string) => parseInputTime(value, data.ref.timeFrom)"
            @update:modelValue="() => changeTime(data)"
          />
          <va-badge 
            overlap
            :text="diffDays(data.ref.timeFrom, data.ref.timeTo)"
          >
            <va-time-input
              class="w-24"
              v-model="data.ref.timeTo"
              manual-input
              :parse="(value: string) => parseInputTime(value, data.ref.timeTo)"
              @update:modelValue="() => changeTime(data)"
            />
          </va-badge>
          <va-divider vertical />
          <va-input
            class="w-28"
            inputClass="text-center font-bold input-time"
            v-model="timeSum"
            ref="inputTimeSum"
            placeholder="00:00:00"
            @update:modelValue="(value: string) => changeTimeSum(value, data)"
          />
          <va-date-input
            class="w-240"
            inputClass="text-center font-bold input-time"
            v-model="date"
            :format="(date: Date) => (DateTime.fromJSDate(new Date(date))).toFormat('dd-MM-yyyy')"
            @update:modelValue="(value: string) => changeDate(value, data)"
          />
        </div>
      </div>
    </template>

    <template #actions="{ save, data }">
      <div class="flex justify-end flex-col-reverse sm:flex-row w-24">
        <va-button v-if="isManual" @click="save()" class="w-full">START</va-button>
        <va-button v-if="!isManual" @click="saveManual();" class="w-full">ADD</va-button>
      </div>
    </template>
  </owl-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'
import { useInputMask, createRegexMask } from 'vuestic-ui'
import { useLocalStorage } from '@vueuse/core';

import OwlForm from '@owl-app/lib-app-core/components/form/form.vue';
import { Client } from '@owl-app/lib-contracts';

const emit = defineEmits<{
  (event: 'saved', clientSaved: Client): void
}>()

const now = DateTime.now().set({ second: 0, millisecond: 0.00 });

const hoverForm = ref(false);
const timeSum = ref('00:00:00');
const date = ref(new Date());
const inputTimeSum = ref();
let oldDate = DateTime.now().set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 });
let hasChangedScope = false;


const defaultValue = {
  timeFrom: now.toJSDate(),
  timeTo: now.toJSDate(),
}

const isManual = useLocalStorage('time-is-manual', false);

const iconColorManual = computed(() => isManual.value ? 'primary' : 'secondary');
const iconColorTimer = computed(() => isManual.value ? 'secondary' : 'primary');

useInputMask(createRegexMask(/(\d){2}:(\d){2}:(\d){2}/), inputTimeSum)

function changeTimeSum(value: string, data: any) {
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeFrom));
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(value);

  if (hours >= 24) {
    hasChangedScope = true;
  }

  data.ref.timeTo = dateFrom.plus({
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }).toJSDate();
}

function parseInputTime(value: string, date: Date): Date {
  const dateTimeTo = DateTime.fromJSDate(new Date(date));
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(value);

  return dateTimeTo.set({ hours, minutes, seconds }).toJSDate();
}

function parseTime(text: string) {
  return text.match(/[0-9]{1,2}/g)?.map(Number) || [];
}

function changeTime(data: any) {
  const currentDate = DateTime.fromJSDate(new Date(date.value));
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeFrom)).set({ millisecond: 0.00 });
  let dateTo = DateTime.fromJSDate(new Date(data.ref.timeTo)).set({ millisecond: 0.00 });
  const [hours = 0] = parseTime(timeSum.value);

  if (hours < 24 && !hasChangedScope) {
    dateTo = currentDate.set({ hours: dateTo.hour, minutes: dateTo.minute, seconds: dateTo.second });

    if (dateTo < dateFrom) {
      dateTo = currentDate.plus({ days: 1 }).set({ hours: dateTo.hour, minutes: dateTo.minute, seconds: dateTo.second });
    }
  } else if (dateTo < dateFrom) {
    dateTo = dateTo.plus({ days: 1 });
  }

  data.ref.timeTo = dateTo.toJSDate();

  timeSum.value = dateTo
    .diff(dateFrom, ["hours", "minutes", "seconds"])
    .toFormat('hh:mm:ss');
}

function changeDate(value: string, data: any) {
  const date = DateTime.fromJSDate(new Date(value));
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeFrom));
  const dateTo = DateTime.fromJSDate(new Date(data.ref.timeTo));

  const { days: diffDaysWithOldDate } = date
    .diff(DateTime.fromJSDate(new Date(oldDate)), ["days"]);

  data.ref.timeFrom = dateFrom.plus({ days: diffDaysWithOldDate }).toJSDate();
  data.ref.timeTo = dateTo.plus({ days: diffDaysWithOldDate }).toJSDate();

  oldDate = new Date(value);
}

function diffDays(timeFrom: string, timeTo: string) {
  const dateFrom = (DateTime.fromJSDate(new Date(timeFrom)))
  const dateTo = (DateTime.fromJSDate(new Date(timeTo)))

  return dateTo.startOf("day").diff(dateFrom.startOf("day"), "days").days;
}
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

    .input-time {
      --va-input-font-weight: bold;
      --va-input-font-size: 1rem;
    }
  }
}
</style>