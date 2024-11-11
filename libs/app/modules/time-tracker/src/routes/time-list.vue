<script lang="ts" setup>
import { ref } from 'vue';
import { DateTime } from 'luxon'
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n';

import type { Time, Tag, Project } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue';
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue';
import DeleteModal from '@owl-app/lib-app-core/components/modal/delete-modal.vue';
import { useApi } from '@owl-app/lib-app-core/composables/use-system'

import CreateInline from '../components/create-inline.vue';

type GroupedWeeksAndDays = Record<string, Record<string, Time[]>>;

const { t } = useI18n();
const api = useApi();

const gridRef = ref<InstanceType<typeof Grid>>();
const showDeleteModal = ref(false);
const deleteTime = ref<Time>();
const deleteModal = ref<InstanceType<typeof DeleteModal>>();
const timerCreateInline = ref<InstanceType<typeof CreateInline>>();
const tags = ref<Tag[]>([]);
const projects = ref<Project[]>([]);

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: ' ', key: 'actions' },
])

loadTags();
loadProjects();

async function loadTags(): Promise<void> {
  const result = await api.get('tags?pageable=0');

  tags.value = result.data?.items;
}

async function loadProjects(): Promise<void> {
  const result = await api.get('projects?pageable=0');

  projects.value = result.data?.items;
}

function groupByWeek(items: Time[]) {
  function getWeekRange(date: string) {
    const curr = DateTime.fromISO(date);

    return {
      from: curr.startOf('week').toFormat('yyyy-MM-dd').toString(),
      to: curr.endOf('week').toFormat('yyyy-MM-dd').toString()
    }
  }

  const groupedWeeks: GroupedWeeksAndDays = items.reduce((acc, obj) => {
    const { from, to } = getWeekRange(obj.timeIntervalStart as string);

    const weekKey = `${from} / ${to}`;
    const dateKey = DateTime.fromISO(obj.timeIntervalStart as string).toLocaleString(DateTime.DATE_FULL);

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
          (a, b) => (b.timeIntervalStart as Date).getTime() - (a.timeIntervalStart as Date).getTime()
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
      ref="timerCreateInline"
      url="times"
      key="main-create"
      manual-name-storage="time-is-manual"
      :is-manual="true"
      :is-manual-only="false"
      :tag-options="tags"
      :project-options="projects"
      @saved="gridRef?.reloadGrid"
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
            <va-card 
              v-for="(groupDay, startDay) in groupWeek"
              :key="startDay"
              class="card-time mb-4"
              square
              outlined
              bordered
            >
              <va-card-title>{{ startDay }}</va-card-title>
              <va-card-content>
                <create-inline
                  v-for="(time) in groupDay"
                  :url="`times/${time.id}`"
                  :key="`${time.id}-${time.timeIntervalStart}-${time.timeIntervalEnd}`"
                  :default-value="time"
                  :is-saved-after-change="true"
                  :tag-options="[
                    ...tags,
                    ...time.tags.filter(tag => tag.archived && !tags.find(existing => tag.id === existing.id))
                  ]"
                  :project-options="[
                    ...projects,
                    ...time?.projects?.filter(tag => tag.archived && !projects?.find(existing => tag.id === existing.id)) ?? []
                  ]"
                  @saved="gridRef?.reloadGrid"
                >
                  <template #actions>
                    <va-divider vertical />
                    <va-icon
                      name="play_arrow"
                      :size="44"
                      class="material-symbols-outlined"
                      aria-label="Update time"
                      @click="() => timerCreateInline?.startTimer(time)"
                    />
                    <va-divider vertical />
                    <div class="flex items-center w-24">
                      <va-button
                        color="danger"
                        icon="delete"
                        aria-label="Delete time"
                        @click="deleteModal?.show(time?.id)"
                        size="small"
                      />
                    </div>
                  </template>
                </create-inline>
              </va-card-content>
            </va-card>
          </div>
        </va-inner-loading>
      </template>
    </grid>
    <delete-modal 
      ref="deleteModal"
      collection="times"
      v-model="showDeleteModal"
      :primaryKey="deleteTime?.id"
      @deleted="gridRef?.reloadGrid"
    />
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