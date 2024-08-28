<template>
  <VaSidebarItem
      :to="{ name: route.name }"
      :active="active"
      :active-color="activeColor"
      :text-color="textColor"
      role="button"
      hover-opacity="0.10"
    >
      <VaSidebarItemContent class="py-3 pr-2 pl-4">
        <VaIcon
          v-if="route.meta.icon"
          aria-hidden="true"
          :name="route.meta.icon"
          size="20px"
          :color="iconColor"
          class="material-symbols-outlined"
        />
        <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
          {{ t(route.displayName) }}
        </VaSidebarItemTitle>
      </VaSidebarItemContent>
    </VaSidebarItem>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

import { INavigationRoute } from './routes'

defineProps<{
  route: INavigationRoute,
  active: boolean,
  activeColor: string,
  textColor: string,
  iconColor: string,
}>()

const { t } = useI18n()

</script>./routes