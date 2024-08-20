<script setup lang="ts">
import { ref } from 'vue';
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n';

import { Client } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue';
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue';
import DeleteModal from '@owl-app/lib-app-core/components/modal/delete-modal.vue';

import CreateInline from '../components/create-inline.vue';
import ClientModal from '../components/client-modal.vue'

const { t } = useI18n();

const showModalUser = ref(false);
const editClient = ref<Client | null>();
const deleteClient = ref<Client>();
const gridRef = ref<InstanceType<typeof Grid>>();

const headerBar = {
  title: t('clients'),
  description: 'Managing clients in system',
  icon: 'sensor_occupied',
}

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: ' ', key: 'actions' },
])
</script>

<template>
    <panel-layout>
      <grid
        ref="gridRef"
        :columns="columns"
        defaultSort="id"
        :headerBar="headerBar"
        url="clients"
      >
        <template #header-bar-actions>
          <create-inline @saved="gridRef?.addItem" />
        </template>

        <template #filters="{ filters, changeFilter, removeFilter }">
          <div class="grid grid-cols-3 gap-4">
            <string-filter 
              :data="filters?.search"
              :change-filter="changeFilter"
              :remove-filter="removeFilter"
            />
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
                deleteClient = client as Client;
              "
            />
          </div>
        </template>
      </grid>
      <client-modal
        v-model="showModalUser"
        :user="editClient"
        @saved="gridRef?.reloadGrid()"
      />
      <delete-modal 
        collection="clients"
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