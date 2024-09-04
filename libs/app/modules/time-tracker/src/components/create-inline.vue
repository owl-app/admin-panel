<template>
  <div class="time-tracker-inline">
    <owl-form collection="times" 
      class-form="flex bg-white p-3"
      :default-value="defaultValue"
      @saved="$emit('saved', $event)"
    >
      <template #fields="{ data, validation }">
        <div class="flex flex-row justify-center">
          <div class="flex flex-col">
          <va-icon
            class="material-symbols-outlined cursor-pointer"
            name="handyman"
            :size="17"
            :color="iconColorManual"
            @click="isManual = true"
          />
          <va-icon
            class="material-symbols-outlined cursor-pointer mt-1"
            name="timer"
            :size="17"
            :color="iconColorTimer"
            @click="isManual = false"
          />
        </div>
          <va-divider vertical />
        </div>
        
        <div class="flex-1 pl-0 pr-4">
          <div class="flex space-x-4">
            <va-input
              label=""
              placeholder="What are you working on ?"
              v-model="data.ref.description"
              name="description"
              background="#fff"
              :error="!!validation['description']"
            />
            <va-time-input 
              class="w-24"
              v-model="data.ref.timeIntervalStart"
              manual-input
              :parse="(value: string) => parseInputTime(value, data.ref.timeIntervalStart)"
              @update:modelValue="() => changeTime(data)"
              v-if="isManual"
            />
            <va-badge 
              overlap
              :offset="[0, 1]"
              :text="diffDays(data.ref.timeIntervalStart, data.ref.timeIntervalEnd)"
              v-if="isManual"
            >
              <va-time-input
                class="w-24"
                v-model="data.ref.timeIntervalEnd"
                manual-input
                :parse="(value: string) => parseInputTime(value, data.ref.timeIntervalEnd)"
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
              v-if="isManual"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps } from 'vue'
import { DateTime } from 'luxon'
import { useInputMask, createRegexMask } from 'vuestic-ui'
import { useLocalStorage } from '@vueuse/core';

import OwlForm from '@owl-app/lib-app-core/components/form/form.vue';
import { Time } from '@owl-app/lib-contracts';

interface Props {
  defaultValue?: Time
  isManual?: boolean,
  manualNameStorage?: string
}

const props = withDefaults(defineProps<Props>(), {
  isManual: true
})

const emit = defineEmits<{
  (event: 'saved', clientSaved: Time): void
}>()

const now = DateTime.now().set({ second: 0, millisecond: 0.00 });
const defaultValue = props.defaultValue || {
  timeIntervalStart: now.toJSDate(),
  timeIntervalEnd: now.toJSDate(),
}

const timeSum = ref(initialTimeSum());
const date = ref(props.defaultValue?.timeIntervalStart ?? new Date());
const inputTimeSum = ref();
const isManual = props.manualNameStorage ? useLocalStorage(props.manualNameStorage, false) : ref(props.isManual);
const iconColorManual = computed(() => isManual.value ? 'primary' : 'secondary');
const iconColorTimer = computed(() => isManual.value ? 'secondary' : 'primary');
let oldDate = DateTime.now().set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 });
let hasChangedScope = false;

useInputMask(createRegexMask(/(\d){2}:(\d){2}:(\d){2}/), inputTimeSum)

function initialTimeSum() {
  if(defaultValue?.timeIntervalStart && defaultValue?.timeIntervalEnd) {
    const timeIntervalStart = DateTime.fromJSDate(new Date(defaultValue.timeIntervalStart));
    const timeIntervalEnd = DateTime.fromJSDate(new Date(defaultValue.timeIntervalEnd));

    return timeIntervalEnd
      .diff(timeIntervalStart, ["hours", "minutes", "seconds"])
      .toFormat('hh:mm:ss');
  }
}

function changeTimeSum(value: string, data: any) {
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart));
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(value);

  if(hours === 0 && minutes === 0 && seconds === 0) return;

  if (hours >= 24) {
    hasChangedScope = true;
  }

  data.ref.timeIntervalEnd = dateFrom.plus({
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
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart)).set({ millisecond: 0.00 });
  let dateTo = DateTime.fromJSDate(new Date(data.ref.timeIntervalEnd)).set({ millisecond: 0.00 });
  const [hours = 0] = parseTime(timeSum.value);

  if (hours < 24 && !hasChangedScope) {
    dateTo = currentDate.set({ hours: dateTo.hour, minutes: dateTo.minute, seconds: dateTo.second });

    if (dateTo < dateFrom) {
      dateTo = currentDate.plus({ days: 1 }).set({ hours: dateTo.hour, minutes: dateTo.minute, seconds: dateTo.second });
    }
  } else if (dateTo < dateFrom) {
    dateTo = dateTo.plus({ days: 1 });
  }

  data.ref.timeIntervalEnd = dateTo.toJSDate();

  timeSum.value = dateTo
    .diff(dateFrom, ["hours", "minutes", "seconds"])
    .toFormat('hh:mm:ss');
}

function changeDate(value: string, data: any) {
  const date = DateTime.fromJSDate(new Date(value));
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart));
  const dateTo = DateTime.fromJSDate(new Date(data.ref.timeIntervalEnd));

  const { days: diffDaysWithOldDate } = date
    .diff(DateTime.fromJSDate(new Date(oldDate)), ["days"]);

  data.ref.timeIntervalStart = dateFrom.plus({ days: diffDaysWithOldDate }).toJSDate();
  data.ref.timeIntervalEnd = dateTo.plus({ days: diffDaysWithOldDate }).toJSDate();

  oldDate = new Date(value);
}

function diffDays(timeIntervalStart: string, timeIntervalEnd: string) {
  const dateFrom = (DateTime.fromJSDate(new Date(timeIntervalStart)))
  const dateTo = (DateTime.fromJSDate(new Date(timeIntervalEnd)))

  console.log('diffDays', dateTo.startOf("day").diff(dateFrom.startOf("day"), "days").days)

  return dateTo.startOf("day").diff(dateFrom.startOf("day"), "days").days;
}
</script>

<style lang="scss" scoped>
.time-tracker-inline {
  --va-input-wrapper-horizontal-padding: 0.6rem;
  --va-input-wrapper-border-color-hover: transparent;
  --va-input-wrapper-border-color: transparent;

  :deep() {
    .input-time {
      --va-input-font-weight: bold;
      --va-input-font-size: 1rem;
    }
  }

  &:hover {
    --va-input-wrapper-border-color: var(--va-background-border);
  }
}
</style>