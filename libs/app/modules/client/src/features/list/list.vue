<template>
    <panel-layout>
      <Grid 
        :columns="columns"
        defaultSort="id"
        :headerBar="headerBar"
        url="clients"
      >
        <template #filters="{ filters, changeFilter }">
          <div class="grid grid-cols-3 gap-4">
            <string-filter :value="filters?.search" :change-filter="changeFilter" />
          </div>
        </template>

      </Grid>
    </panel-layout>
</template>
  
<script setup>
import { defineVaDataTableColumns } from 'vuestic-ui/web-components';
import { useI18n } from 'vue-i18n'

import Grid from '@owl-app/lib-app-core/components/grid/grid.vue'
import StringFilter from '@owl-app/lib-app-core/components/grid/components/filters/string.vue'

const { t } = useI18n();

const headerBar = {
  title: t('clients'),
  description: 'Managing clients in system',
  icon: 'sensor_occupied',
}

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
])
</script>