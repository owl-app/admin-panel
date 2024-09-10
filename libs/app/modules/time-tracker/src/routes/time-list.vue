<script lang="ts" setup>
import { ref } from 'vue';
import { DateTime } from 'luxon'
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n';

import { Time } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue';
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue';

import CreateInline from '../components/create-inline.vue';

type GroupedWeeksAndDays = Record<string, Record<string, Time[]>>;

const { t } = useI18n();

const gridRef = ref<InstanceType<typeof Grid>>();

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: ' ', key: 'actions' },
])

function groupByWeek(items: Time[]) {
  function getWeekRange(date: string | Date) {
    const curr = DateTime.fromISO(date);

    return {
      from: curr.startOf('week').toFormat('yyyy-MM-dd').toString(),
      to: curr.endOf('week').toFormat('yyyy-MM-dd').toString()
    }
  }

  const groupedWeeks: GroupedWeeksAndDays = items.reduce((acc, obj) => {
    const { from, to } = getWeekRange(obj.timeIntervalStart);

    const weekKey = `${from} / ${to}`;
    const dateKey = DateTime.fromISO(obj.timeIntervalStart).toLocaleString(DateTime.DATE_FULL);

    if (!acc[weekKey]) {
      acc[weekKey] = {} as Record<string, Time[]>;
    }

    if (!acc[weekKey][dateKey as string]) {
      acc[weekKey][dateKey as string] = [];
    }

    acc[weekKey][dateKey as string].push({
      ...obj,
      ...{
        timeIntervalStart: new Date(obj.timeIntervalStart),
        timeIntervalEnd: new Date(obj.timeIntervalEnd)
      }
    });

    return acc;
  }, {} as GroupedWeeksAndDays);

  for (const weekKey in groupedWeeks) {
    groupedWeeks[weekKey] = Object.keys(groupedWeeks[weekKey])
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .reduce((sortedAcc: { [date: string]: Time[] }, dateKey: string) => {
          sortedAcc[dateKey] = groupedWeeks[weekKey][dateKey];
          return sortedAcc;
      }, {});

    for (const dateKey in groupedWeeks[weekKey]) {
      groupedWeeks[weekKey][dateKey].sort(
          (a, b) => DateTime.fromJSDate(b.timeIntervalStart) - DateTime.fromJSDate(a.timeIntervalStart)
      );
    }
  }

  const sortedByWeeks = Object.entries(groupedWeeks)
    .sort((a, b) => {
      const [fromA] = a[0].split('/');
      const [fromB] = b[0].split('/');

      return new Date(fromB).getTime() - new Date(fromA).getTime();
    })
    .reduce((acc: GroupedWeeksAndDays, [week, items]) => {
      acc[week] = items;
      return acc;
    }, {});

  return sortedByWeeks;
}
</script>

<template>
  <panel-layout>

    <create-inline
      url="times"
      manual-name-storage="time-is-manual"
      :is-manual="true"
      :is-manual-only="false"
      @saved="gridRef?.addItem"
    >
      <template #actions="{ save, isManual, startTimer, isTimerStart }">
          <va-button v-if="!isManual && !isTimerStart" @click="startTimer()" class="w-full">START</va-button>
          <va-button v-if="isManual" @click="save()" class="w-full">ADD</va-button>
      </template>
    </create-inline>

    <div class="mb-10" />

    <grid ref="gridRef" :columns="columns" defaultSort="id" url="times" layout="custom">
      <template #filters="{ filters, changeFilter, removeFilter }">
        <div class="grid grid-cols-3 gap-4">
          <string-filter :data="filters?.search" :change-filter="changeFilter" :remove-filter="removeFilter" />
        </div>
      </template>

      <template #custom="{ items, loading }">
        <va-inner-loading :loading="loading">
          <div v-for="(groupWeek, startWeek) in groupByWeek(items as Time[])" :key="startWeek">
            <va-chip class="mb-4">{{ startWeek }}</va-chip>
            <va-card v-for="(groupDay, startDay) in groupWeek" class="card-time mb-4" square outlined bordered
              :key="startDay">
              <va-card-title>{{ startDay }}</va-card-title>
              <va-card-content>
                <create-inline
                  v-for="(time, index) in groupDay"
                  :url="`times/${time.id}`"
                  :key="time.id"
                  :index="index"
                  :default-value="time"
                  :is-saved-after-change="true"
                  @saved="gridRef?.reloadGrid"
                />
              </va-card-content>
            </va-card>
          </div>
        </va-inner-loading>
      </template>
    </grid>
  </panel-layout>
</template>

<style lang="scss" scoped>
:deep() {
  .wrapper-grid {
    .header-actions {
      align-self: center;
      justify-self: end;
    }

    .va-card {
      .card-time {
        --va-card-padding: 0px;
        --va-card-outlined-border: thin solid #e0e0e0;

        .va-card-title {
          font-size: 0.75rem;
          font-weight: bold;
          padding: 0.75rem !important;
          background-color: #f5f5f5;
          border-bottom: var(--va-card-outlined-border);
          border-radius: 0;
        }

        .time-tracker-inline {
          border-bottom: var(--va-card-outlined-border);
        }
      }
    }
  }
}
</style>