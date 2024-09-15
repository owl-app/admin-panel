<template>
  <div class="time-tracker-inline">
    <owl-form
      ref="timerForm"
      :collection="url" 
      class-form="flex space-x-4 items-center bg-white p-3"
      :default-value="defaultValue"
      :clear-form-after-save="false"
      @saved="afterSave"
    >
      <template #fields="{ data, validation }">
        <div class="flex flex-row justify-center" v-if="!isTimerStart && !isManualOnly">
          <div class="flex flex-col">
            <va-icon
              class="material-symbols-outlined cursor-pointer"
              name="handyman"
              :size="17"
              :color="iconColorManual"
              @click="changeManual(true, data)"
            />
            <va-icon
              class="material-symbols-outlined cursor-pointer mt-1"
              name="timer"
              :size="17"
              :color="iconColorTimer"
              @click="changeManual(false, data)"
            />
          </div>
          <va-divider vertical />
        </div>
        <va-input
          label=""
          placeholder="What are you working on ?"
          v-model="data.ref.description"
          name="description"
          background="#fff"
          :error="!!validation['description']"
          @change="() => { if (isSavedAfterChange) savedAfterChange(data.ref) }"
        />
        <div @focusout="() => changeTime(data)" v-if="isManual">
          <va-time-input 
            class="w-24"
            v-model="data.ref.timeIntervalStart"
            manual-input
            :parse="(value: string) => parseInputTime(value, data.ref.timeIntervalStart)"
          />
        </div>
        <div @focusout="() => changeTime(data)" v-if="isManual">
          <va-badge 
            overlap
            :text="diffDays(data.ref.timeIntervalStart, data.ref.timeIntervalEnd)"
          >
            <va-time-input
              class="w-24"
              v-model="data.ref.timeIntervalEnd"
              manual-input
              :parse="(value: string) => parseInputTime(value, data.ref.timeIntervalEnd)"
            />
          </va-badge>
        </div>
        <va-date-input
          class="w-36"
          inputClass="text-center font-bold input-time"
          v-model="data.ref.date"
          :format="(date: Date) => (DateTime.fromJSDate(new Date(date))).toFormat('dd-MM-yyyy')"
          firstWeekday="Monday"
          @update:modelValue="(value: string) => changeDate(value, data)"
          v-if="isManual"
        />
        <va-divider vertical class="self-stretch" />
        <va-input
          class="w-28"
          inputClass="text-center font-bold input-time"
          v-model="data.ref.timeSum"
          ref="inputTimeSum"
          placeholder="00:00:00"
          name="timeSum"
          @blur="() => changeTimeSum(data)"
          v-if="isManual"
        />
        <va-input
          class="w-28"
          inputClass="text-center font-bold input-time"
          v-model="timeStore.timer"
          readonly
          name="timeSumTimer"
          placeholder="00:00:00"
          v-if="!isManual"
        />
      </template>

      <template #actions="{ save }">
        <div class="flex justify-end flex-col-reverse sm:flex-row min-w-24">
          <slot
            name="actions"
            :save="save"
            :is-manual="isManual"
            :start-timer="startTimer"
            :is-timer-start="isTimerStart"
          />
          <va-button
            @click="endTimer"
            class="w-full"
            color="danger"
            v-if="isTimerStart && !isManualOnly"
          >
            STOP
          </va-button>
        </div>
      </template>
    </owl-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps, Ref, defineExpose } from 'vue'
import { useI18n } from 'vue-i18n';
import { DateTime } from 'luxon'
import { useInputMask, createRegexMask } from 'vuestic-ui'
import { useToast } from 'vuestic-ui/web-components';
import { useLocalStorage } from '@vueuse/core';

import { Time } from '@owl-app/lib-contracts';

import OwlForm from '@owl-app/lib-app-core/components/form/form.vue';
import { useApi } from '@owl-app/lib-app-core/composables/use-system'
import { useStores } from '@owl-app/lib-app-core/composables/use-system'

interface Props {
  url: string,
  defaultValue?: Time,
  isManual?: boolean,
  manualNameStorage?: string
  isSavedAfterChange?: boolean
  isManualOnly?: boolean
}

export type TimeFormData = {
  description?: string
  timeIntervalStart: Date,
  timeIntervalEnd: Date,
  date: Date | string,
  timeSum: string
}

const props = withDefaults(defineProps<Props>(), {
  isManual: true,
  isSavedAfterChange: false,
  isManualOnly: true
})

const emit = defineEmits<{
  (event: 'saved', clientSaved: Time): void,
}>()

defineExpose({
  startTimer
})

const api = useApi();
const { t } = useI18n();
const { init: notify } = useToast();
const { useTimeStore } = useStores();
const timeStore = useTimeStore();

let hasChangedScope = false;
const now = DateTime.now().set({ second: 0, millisecond: 0.00 });
const defaultValue: TimeFormData = parseDefaultValue(props.defaultValue);

const timerForm = ref<any>(null)
const inputTimeSum = ref();
const isManual = props.manualNameStorage ? useLocalStorage(props.manualNameStorage, false) : ref(props.isManual);
const iconColorManual = computed(() => isManual.value ? 'primary' : 'secondary');
const iconColorTimer = computed(() => isManual.value ? 'secondary' : 'primary');
const isTimerStart = ref(timeStore.active ?? false);

let oldData: TimeFormData = {
  timeIntervalStart: new Date(defaultValue.timeIntervalStart), 
  timeIntervalEnd: new Date(defaultValue.timeIntervalEnd), 
  date: new Date(defaultValue.date),
  timeSum: defaultValue.timeSum
};

useInputMask(createRegexMask(/(\d){2}:(\d){2}:(\d){2}/), inputTimeSum)

function parseDefaultValue(value?: Time): TimeFormData {
  if(!value) {
    return {
      description: '',
      timeIntervalStart: now.toJSDate(),
      timeIntervalEnd: now.toJSDate(),
      date: now.set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 }).toJSDate(),
      timeSum: '00:00:00'
    }
  };

  const timeIntervalStart = DateTime.fromJSDate(new Date(value.timeIntervalStart));
  const timeIntervalEnd = DateTime.fromJSDate(new Date(value.timeIntervalEnd));
  const timeSum = timeIntervalEnd
      .diff(timeIntervalStart, ["hours", "minutes", "seconds"])
      .toFormat('hh:mm:ss');
  const [hours = 0] = parseTime(timeSum);

  setChangedScope(timeIntervalStart, timeIntervalEnd, hours);

  return {
    description: value.description,
    timeIntervalStart: timeIntervalStart.toJSDate(),
    timeIntervalEnd: timeIntervalEnd.toJSDate(),
    date: DateTime
      .fromJSDate(new Date(value.timeIntervalStart))
      .set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 })
      .toJSDate(),
    timeSum: timeSum
  }
}

function changeManual(value: boolean, data: { ref: TimeFormData }) {
  isManual.value = value;

  if (value) {
    data.ref.timeIntervalStart = now.toJSDate();
    data.ref.timeIntervalEnd = now.toJSDate();
    data.ref.date = DateTime.fromJSDate(new Date()).set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 })
  }
}

function changeTimeSum(data: { ref: TimeFormData }) {
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart));
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(data.ref.timeSum);

  if(hours === 0 && minutes === 0 && seconds === 0) return;

  const dateTo = dateFrom.plus({
    hours: hours,
    minutes: minutes,
    seconds: seconds
  });

  oldData.timeIntervalEnd = data.ref.timeIntervalEnd = dateTo.toJSDate();

  setChangedScope(dateFrom, dateTo, hours);

  if (props.isSavedAfterChange && oldData.timeSum !== data.ref.timeSum) {
    savedAfterChange(data.ref)
    oldData.timeSum = data.ref.timeSum;
  }
}

function changeTime(data: { ref: TimeFormData }) {
  if (
    oldData.timeIntervalStart.getTime() !== data.ref.timeIntervalStart.getTime() ||
    oldData.timeIntervalEnd.getTime() !== data.ref.timeIntervalEnd.getTime()
  ) {
    const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart));
    let dateTo = DateTime.fromJSDate(new Date(data.ref.timeIntervalEnd));

    if (hasChangedScope) {
      const currentDateTo = dateTo.set({ hours: dateFrom.hour, minutes: dateFrom.minute, seconds: dateFrom.second });

      if (dateTo >= currentDateTo) {
        dateTo = dateTo.minus({ days: 1 }).set({ hours: dateTo.hour, minutes: dateTo.minute, seconds: dateTo.second });
        hasChangedScope = false;
      }
    } else if (dateTo < dateFrom) {
      dateTo = dateTo.plus({ days: 1 });
      hasChangedScope = true;
    }

    data.ref.timeIntervalEnd = dateTo.toJSDate();

    data.ref.timeSum = dateTo
      .diff(dateFrom, ["hours", "minutes", "seconds"])
      .toFormat('hh:mm:ss');

    if(props.isSavedAfterChange) {
      savedAfterChange(data.ref);
    }

    oldData.timeIntervalStart = dateFrom.toJSDate();
    oldData.timeIntervalEnd = dateTo.toJSDate();
  }
}

function changeDate(value: string, data: { ref: TimeFormData }) {
  const date = DateTime.fromJSDate(new Date(value));
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart));
  const dateTo = DateTime.fromJSDate(new Date(data.ref.timeIntervalEnd));

  const { days: diffDaysWithOldDate } = date
    .diff(DateTime.fromJSDate(new Date(oldData.date)), ["days"]);

  data.ref.timeIntervalStart = dateFrom.plus({ days: diffDaysWithOldDate }).toJSDate();
  data.ref.timeIntervalEnd = dateTo.plus({ days: diffDaysWithOldDate }).toJSDate();

  oldData.date = new Date(value);

  if(props.isSavedAfterChange) {
    savedAfterChange(data.ref)
  }
}

function diffDays(timeIntervalStart: string, timeIntervalEnd: string) {
  const dateFrom = (DateTime.fromJSDate(new Date(timeIntervalStart)))
  const dateTo = (DateTime.fromJSDate(new Date(timeIntervalEnd)))

  return dateTo.startOf("day").diff(dateFrom.startOf("day"), "days").days;
}

function afterSave(savedData: Time, dataForm: Ref<TimeFormData>) {
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(dataForm.value.timeSum);
  const timeIntervalStart = DateTime
    .fromJSDate(new Date(savedData.timeIntervalStart))
    .plus({ hours, minutes, seconds });
  const timeIntervalEnd = DateTime
    .fromJSDate(new Date(savedData.timeIntervalEnd))
    .plus({ hours, minutes, seconds });

  dataForm.value = {
    timeIntervalStart: timeIntervalStart.toJSDate(),
    timeIntervalEnd: timeIntervalEnd.toJSDate(),
    date: timeIntervalEnd
      .set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 })
      .toJSDate(),
    timeSum: timeIntervalEnd
      .diff(timeIntervalStart, ["hours", "minutes", "seconds"])
      .toFormat('hh:mm:ss')
  }

  emit('saved', savedData);
}

async function savedAfterChange(data: any) {
  await api.put(`${props.url}`, data);

  notify({
    message: t('item_update_success'),
    color: 'success',
    position: 'bottom-right',
    offsetY: 30
  })

  emit('saved', data);
}

async function startTimer(time?: Time) {
  if (timeStore.intervalTimer) {
    timeStore.stopTimer();
  };

  if (time) {
    timerForm.value.formData = {
      description: time.description
    }
  }

  if (time) {
    await timeStore.continueTimer(time.id);
  } else {
    await timeStore.startTimer(
      timerForm.value.formData.description
    );
  }

  isTimerStart.value = true;
  isManual.value = false;
}

function endTimer() {
  timeStore.stopTimer();
  isTimerStart.value = false;
};

function parseInputTime(value: string, date: Date): Date {
  const dateTimeTo = DateTime.fromJSDate(new Date(date));
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(value);

  return dateTimeTo.set({ hours, minutes, seconds }).toJSDate();
}

function parseTime(text: string) {
  return text.match(/[0-9]{1,2}/g)?.map(Number) || [];
}

function setChangedScope(dateFrom: DateTime, dateTo: DateTime, hours: number) {
  if (dateTo.startOf("day").diff(dateFrom.startOf("day"), "days").days > Math.floor(hours / 24)) {
    hasChangedScope = true;
  } else {
    hasChangedScope = false;
  }
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

    .va-date-input {
      .va-input-wrapper {
        &__field {
          flex-direction: row-reverse;
        }
      }
    }
  }

  &:hover {
    --va-input-wrapper-border-color: var(--va-background-border);
  }
}
</style>