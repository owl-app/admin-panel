<script setup lang="ts">
import { ref } from 'vue';
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n';

import { Client } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue';
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue';
import DeleteModal from '@owl-app/lib-app-core/components/modal/delete-modal.vue';

import CreateInline from '../components/create-inline.vue';

const { t } = useI18n();

const showModalUser = ref(false);
const showDeleteModal = ref(false);
const editClient = ref<Client | null>();
const deleteClient = ref<Client>();
const gridRef = ref<InstanceType<typeof Grid>>();

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: ' ', key: 'actions' },
])
function groupByWeek(items: Client[]) {
  const groups: Record<string, any> = {};

  for (const obj of items) {
    const startOfWeek = new Date(obj.createdAt);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);

    const endOfWeek = new Date(obj.createdAt);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const weekRange = `${startOfWeek.toISOString().split('T')[0]} to ${endOfWeek.toISOString().split('T')[0]}`;

    if (!groups[weekRange]) {
      groups[weekRange] = [];
    }

    groups[weekRange].push(obj);
  }

  // Sort the groups in ascending order of the week range
  const sortedGroups: Record<string, any>  = {};

  Object.keys(groups).sort().forEach(key => {
    sortedGroups[key] = groups[key];
  });

  return sortedGroups;
}
</script>

<template>
  <panel-layout>
    <create-inline @saved="gridRef?.addItem" />

    <grid
      ref="gridRef"
      :columns="columns"
      defaultSort="id"
      url="clients"
      layout="custom"
    >
      <template #filters="{ filters, changeFilter, removeFilter }">
        <div class="grid grid-cols-3 gap-4">
          <string-filter 
            :data="filters?.search"
            :change-filter="changeFilter"
            :remove-filter="removeFilter"
          />
        </div>
      </template>
      
      <template #custom="{items}">
        <div
          v-for="(group, start) in groupByWeek(items as Client[])" :key="start"
        >
        <va-chip>{{ start }}</va-chip>
          <div>
          <div class="grid grid-cols-5 gap-4">
              <div
                v-for="client in group"
                :key="client.id"
              >
                <VaValue v-slot="doShowInput">
                <div style="height: 40px; width: 200px;"  @mouseover="doShowInput.value = true" @mouseleave="doShowInput.value = false">
                    <VaInput
                      :model-value="client.name"
                      @change="($event) => {
                        row.rowData[item.key] = $event.target.value
                        doShowInput.value = false
                      }"
                      @blur="doShowInput.value = false"
                      autofocus
                    />
                </div>
                </VaValue>
            </div>
          </div>
        </div>
      </div>
      </template>

      <template #cell(actions)="{ rowData: client }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit project"
            @click="
              editClient = client as Client;
              showModalUser = true;
            "
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete project"
            @click="
              showDeleteModal = true;
              deleteClient = client as Client;
            "
          />
        </div>
      </template>
    </grid>
    <delete-modal 
      collection="clients"
      v-model="showDeleteModal"
      :primaryKey="deleteClient?.id"
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
  }
}
</style>