<script setup lang="ts">
import { ref } from 'vue';
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n';

import { AvalilableCollections, Client, CrudActions } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue';
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue';
import DeleteModal from '@owl-app/lib-app-core/components/modal/delete-modal.vue';
import { usePermissions } from '@owl-app/lib-app-core/composables/use-permissions';

import CreateInline from '../components/create-inline.vue';
import ClientModal from '../components/client-modal.vue'

const { t } = useI18n();

const showModalUser = ref(false);
const showDeleteModal = ref(false);
const editClient = ref<Client | null>();
const gridRef = ref<InstanceType<typeof Grid>>();
const clientModal = ref<InstanceType<typeof ClientModal>>();
const deleteModal = ref<InstanceType<typeof DeleteModal>>();

const { hasRoutePermission } = usePermissions(AvalilableCollections.CLIENT);

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
        <create-inline @saved="gridRef?.addItem" v-if="hasRoutePermission(CrudActions.CREATE)" />
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
            aria-label="Edit client"
            @click="clientModal?.show(client)"
            v-if="hasRoutePermission(CrudActions.UPDATE)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete client"
            @click="deleteModal?.show(client?.id)"
            v-if="hasRoutePermission(CrudActions.DELETE)"
          />
        </div>
      </template>
    </grid>
    <client-modal
      ref="clientModal"
      v-model="showModalUser"
      :user="editClient"
      @saved="gridRef?.reloadGrid()"
    />
    <delete-modal 
      ref="deleteModal"
      collection="clients"
      v-model="showDeleteModal"
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