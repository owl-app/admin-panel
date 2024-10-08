<script setup lang="ts">
import { ref } from 'vue';
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n';

import { Permission } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue';
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue';
import DeleteModal from '@owl-app/lib-app-core/components/modal/delete-modal.vue';

import PermissionModal from '../components/permission-modal.vue'
import ReferSelect from '../components/form/refer-select.vue';
import CollectionSelect from '../components/form/collection-select.vue';

const { t } = useI18n();

const showModalPermission = ref(false);
const showDeleteModal = ref(false);
const editPermission = ref<Permission | null>();
const deletePermission = ref<Permission>();
const gridRef = ref<InstanceType<typeof Grid>>();
const deleteModal = ref<InstanceType<typeof DeleteModal>>();

const headerBar = {
  title: t('permissions'),
  description: 'Managing permissions in system',
  icon: 'vpn_key',
}

const columns = defineVaDataTableColumns([
  { label: 'Description', key: 'description', sortable: true },
  { label: 'Canonical name', key: 'name', sortable: true },
  { label: 'Refer', key: 'refer', sortable: true },
  { label: 'Collection', key: 'collection', sortable: true },
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
      url="rbac/permissions"
    >
      <template #header-bar-actions>
        <VaButton
          preset="primary"
          size="medium"
          color="primary"
          icon="mso-add"
          aria-label="Add permission"
          @click="
            editPermission = null;
            showModalPermission = true;
          "
        >
          Add permission
        </VaButton>
      </template>

      <template #filters="{ filters, changeFilter, removeFilter }">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <string-filter 
              :data="filters?.search"
              :change-filter="changeFilter"
              :remove-filter="removeFilter"
            />
          </div>
          <div class="col-span-2">
            <refer-select
              :modelValue="filters.refer"
              clearable
              @update:model-value="(value: string) => changeFilter({ refer: value })"
              @clear="() => removeFilter('refer')"
            />
          </div>
          <div class="col-span-2">
            <collection-select
              :modelValue="filters.collection"
              clearable
              @update:model-value="(value: string) => changeFilter({ collection: value })"
              @clear="() => removeFilter('collection')"
            />
          </div>
        </div>
      </template>

      <template #cell(actions)="{ rowData: permission }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit project"
            @click="
              editPermission = permission as Permission;
              showModalPermission = true;
            "
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete project"
            @click="deleteModal?.show(permission?.name)"
          />
        </div>
      </template>
    </grid>
    <permission-modal
      v-model="showModalPermission"
      :permission="editPermission"
      @saved="gridRef?.reloadGrid()"
    />
    {{ deletePermission }}
    <delete-modal 
      ref="deleteModal"
      collection="rbac/permissions"
      v-model="showDeleteModal"
      :primaryKey="deletePermission?.name"
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