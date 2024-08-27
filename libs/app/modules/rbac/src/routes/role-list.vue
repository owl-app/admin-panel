<script setup lang="ts">
import { ref } from 'vue';
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n';

import { Role, RoleSetting } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue';
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue';
import DeleteModal from '@owl-app/lib-app-core/components/modal/delete-modal.vue';

import RoleModal from '../components/role-modal.vue'

const { t } = useI18n();

const showModalRole = ref(false);
const showDeleteModal = ref(false);
const editRole = ref<Role | null>();
const deleteRole = ref<Role>();
const gridRef = ref<InstanceType<typeof Grid>>();

const headerBar = {
  title: t('roles'),
  description: 'Managing roles in system',
  icon: 'admin_panel_settings',
}

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'settingDsiplayName', sortable: true },
  { label: 'Description', key: 'description', sortable: true },
  { label: 'Theme', key: 'setting.theme', sortable: true },
  { label: 'Canonical name', key: 'name', sortable: true },
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
      url="rbac/roles"
      grid
    >
      <template #header-bar-actions>
        <VaButton
          preset="primary"
          size="medium"
          color="primary"
          icon="mso-add"
          aria-label="Add role"
          @click="
            editRole = null;
            showModalRole = true;
          "
        >
          Add role
        </VaButton>
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

      <template #cell(settingDsiplayName)="{ rowData: { setting: { displayName } } }">
        <va-chip>
          {{ displayName }}
        </va-chip>
      </template>

      <template #cell(actions)="{ rowData: role }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="#229635"
            icon="mso-join"
            aria-label="Assign permissions"
            tag="router-link"
            :to="{ name: 'role-permission-assign', params: { roleId: role.name } }"
          />
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit project"
            @click="
              editRole = role as Role;
              showModalRole = true;
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
              deleteRole = role as Role;
            "
          />
        </div>
      </template>
    </grid>
    <role-modal
      v-model="showModalRole"
      :role="editRole"
      @saved="gridRef?.reloadGrid()"
    />
    <delete-modal 
      collection="rbac/roles"
      v-model="showDeleteModal"
      :primaryKey="deleteRole?.name"
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