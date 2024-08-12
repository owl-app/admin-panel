<template>
    <panel-layout>
      <Grid 
        :columns="columns"
        defaultSort="id"
        :pageHeader="{ title: 'Users' }"
      >
        <template #filters="{ filters, changeFilter }">
          <input :value="filters?.email" @input="changeFilter" />
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
      </Grid>
    </panel-layout>
</template>
  
<script setup>
import Grid from '@owl-app/lib-app-core/components/grid/grid.vue'

const columns = [
  { label: 'Full Name', key: 'fullname', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Phone number', key: 'phoneNumber', sortable: true },
]
</script>