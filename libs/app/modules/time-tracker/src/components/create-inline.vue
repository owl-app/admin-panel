<template>
  <div class="time-tracker-inline">
    <owl-form
      ref="timerForm"
      :collection="url" 
      class-form="flex bg-white p-3"
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
              @change="() => savedAfterChange(data.ref)"
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
              v-model="date"
              :format="(date: Date) => (DateTime.fromJSDate(new Date(date))).toFormat('dd-MM-yyyy')"
              firstWeekday="Monday"
              @update:modelValue="(value: string) => changeDate(value, data)"
              v-if="isManual"
            />
            <va-divider vertical />
            <va-input
              class="w-28"
              inputClass="text-center font-bold input-time"
              v-model="timeSum"
              ref="inputTimeSum"
              placeholder="00:00:00"
              @blur="() => changeTimeSum(data)"
              v-if="isManual"
            />
            <va-input
              class="w-28"
              inputClass="text-center font-bold input-time"
              v-model="timeStore.timer"
              readonly
              placeholder="00:00:00"
               v-if="!isManual"
            />
          </div>
        </div>
      </template>

      <template #actions="{ save }">
        <div class="flex justify-end flex-col-reverse sm:flex-row w-24">
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
  defaultValue?: Time
  isManual?: boolean,
  manualNameStorage?: string
  isSavedAfterChange?: boolean
  isManualOnly?: boolean
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

const now = DateTime.now().set({ second: 0, millisecond: 0.00 });
const defaultValue = props.defaultValue || {
  timeIntervalStart: now.toJSDate(),
  timeIntervalEnd: now.toJSDate(),
}

const timerForm = ref<any>(null)
const timeSum = ref(initialTimeSum());
const date = ref(props.defaultValue?.timeIntervalStart ?? new Date());
const inputTimeSum = ref();
const isManual = props.manualNameStorage ? useLocalStorage(props.manualNameStorage, false) : ref(props.isManual);
const iconColorManual = computed(() => isManual.value ? 'primary' : 'secondary');
const iconColorTimer = computed(() => isManual.value ? 'secondary' : 'primary');
const isTimerStart = ref(timeStore.active ?? false);

let oldData = {
  timeIntervalStart: new Date(defaultValue.timeIntervalStart), 
  timeIntervalEnd: new Date(defaultValue.timeIntervalEnd), 
  date: DateTime.fromJSDate(new Date(date.value)).set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 }),
  timeSum: timeSum.value
};
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

function changeTimeSum(data: any) {
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart));
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(timeSum.value);

  if(hours === 0 && minutes === 0 && seconds === 0) return;

  if (hours >= 24) {
    hasChangedScope = true;
  }

  data.ref.timeIntervalEnd = dateFrom.plus({
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }).toJSDate();

  if (props.isSavedAfterChange && oldData.timeSum !== timeSum.value) {
    savedAfterChange(data.ref)
    oldData.timeSum = timeSum.value;
  }
}

function changeTime(data: any) {
  const currentDate = DateTime.fromJSDate(new Date(date.value));
  const dateFrom = DateTime.fromJSDate(new Date(data.ref.timeIntervalStart)).set({ millisecond: 0.00 });
  const [hours = 0] = parseTime(timeSum.value);
  let dateTo = DateTime.fromJSDate(new Date(data.ref.timeIntervalEnd)).set({ millisecond: 0.00 });

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

  if(props.isSavedAfterChange && 
    (
      oldData.timeIntervalStart.getTime() !== data.ref.timeIntervalStart.getTime() ||
      oldData.timeIntervalEnd.getTime() !== data.ref.timeIntervalEnd.getTime()
    )
  ) {
    savedAfterChange(data.ref);
    oldData.timeIntervalStart = dateFrom.toJSDate();
    oldData.timeIntervalEnd = dateTo.toJSDate();
  }
}

function changeDate(value: string, data: any) {
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

function afterSave(savedData: Time, dataForm: Ref) {
  const [hours = 0, minutes = 0, seconds = 0] = parseTime(timeSum.value);
  const timeIntervalStart = DateTime
    .fromJSDate(new Date(savedData.timeIntervalStart))
    .plus({ hours, minutes, seconds });
  const timeIntervalEnd = DateTime
    .fromJSDate(new Date(savedData.timeIntervalEnd))
    .plus({ hours, minutes, seconds });

  dataForm.value = {
    timeIntervalStart: timeIntervalStart.toJSDate(),
    timeIntervalEnd: timeIntervalEnd.toJSDate()
  }

  date.value = timeIntervalEnd
    .set({ hours: 0, minute: 0, second: 0, millisecond: 0.00 })
    .toJSDate();

  notify({
    message: t('item_create_success'),
    color: 'success',
    position: 'bottom-right',
    offsetY: 30
  })

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

function startTimer(time?: Time) {
  if (timeStore.intervalTimer) {
    timeStore.stopTimer();
  };

  if (time) {
    timerForm.value.formData = {
      description: time.description
    }
  }

  timeStore.startTimer();
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