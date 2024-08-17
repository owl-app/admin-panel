<template>
    <panel-layout>
      <VaButton
              preset="primary"
              size="small"
              color="primary"
              icon="mso-edit"
              aria-label="Edit project"
              @click="
                showModalUser = true;
              "
            />

      <grid 
        url="users"
        :columns="columns"
        defaultSort="id"
        :headerBar="headerBar"
      >
        <template #filters="{ filters, changeFilter, removeFilter }">
          <div class="grid grid-cols-3 gap-4">
            <string-filter 
              :value="filters?.search"
              :change-filter="changeFilter"
              :remove-filter="removeFilter"
            />
          </div>
        </template>

        <template #cell(fullname)="{ rowData }">
          <div class="flex items-center gap-2 max-w-[230px] ellipsis">
            {{ rowData.firstName }} {{ rowData.lastName }} 
          </div>
        </template>

        <template #cell(email)="{ rowData }">
          <div class="ellipsis max-w-[230px]">
            {{ rowData.email }}
          </div>
        </template>

        <template #cell(phoneNumber)="{ rowData }">
          <div class="flex items-center gap-2 max-w-[230px] ellipsis">
            {{ rowData.phoneNumber }}
          </div>
        </template>

        <template #cell(actions)="{ rowData: user }">
          <div class="flex gap-2 justify-end">
            <VaButton
              preset="primary"
              size="small"
              color="primary"
              icon="mso-edit"
              aria-label="Edit project"
              @click="
                editUser = user;
                showModalUser = true;
              "
            />
            <VaButton
              preset="primary"
              size="small"
              icon="mso-delete"
              color="danger"
              aria-label="Delete project"
            />
        </div>
        </template>
      </grid>
      <user-modal
        v-model="showModalUser"
        :user="editUser"
        @update:model-value="updateModelValue"
      />
    </panel-layout>
</template>
  
<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n'
import { ref } from 'vue';

import { User } from "@owl-app/lib-contracts";

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue'
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue'

import Create from '../create/create.vue'
import UserModal from '../../components/user-modal.vue'

const { t } = useI18n();

const editUser = ref<User>();
const showModalUser = ref(false);

const headerBar = {
  title: t('users'),
  description: 'Managing users who have access to the panel',
  icon: 'people_alt',
}

const columns = defineVaDataTableColumns([
  { label: 'Full Name', key: 'fullname', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Phone number', key: 'phoneNumber', sortable: true },
  { label: ' ', key: 'actions' },
])

function updateModelValue() {
  editUser.value = undefined;
}
</script>