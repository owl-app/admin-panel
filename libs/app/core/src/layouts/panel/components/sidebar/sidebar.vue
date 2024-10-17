<script lang="ts" setup>
import { watch, ref, computed, defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'

import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'

import getRoutes, { type INavigationRoute } from './routes'
import SidebarItem from './sidebar-item.vue'

const props = defineProps({
  visible: { type: Boolean, default: true },
  mobile: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'update:visible'): void
}>()

const { getColor, colorToRgba } = useColors()
const route = useRoute()
const { t } = useI18n()

const value = ref<boolean[]>([])

const writableVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible'),
})

const isActiveChildRoute = (child: INavigationRoute) => {
  if(typeof route?.name === 'string') {
    if (route?.name?.includes(`${child.name}`)) {
      return true;
    }

    if (route?.name?.includes(`${child.meta?.untrackedPages}`)) {
      return true;
    }
  }

  return false;
}

const routeHasActiveChild = (section: INavigationRoute) => {
  if (!section.children) {
    return route?.name === section.name ||
    (typeof route?.name === 'string' && route?.name?.includes(`${section.meta?.untrackedPages}`))
  }

  return section.children.some(({ name, meta }) => {
    return typeof route?.name === 'string' && 
      (route?.name?.includes(`${name}`) || route?.name?.includes(`${meta?.untrackedPages}`))
  })
}

const filterRoutesByPermission = (routes: INavigationRoute[]): INavigationRoute[] => {
  return routes
    .filter(route => route.hasPermission || route.children)
    .map(route => {
      if (route.children) {
        return {
          ...route,
          children: filterRoutesByPermission(route.children)
        };
      }

      return route;
    });
}

const navigationRoutes = getRoutes();

const setActiveExpand = () =>
  (value.value = navigationRoutes.routes.map((route: INavigationRoute) => routeHasActiveChild(route)))

const sidebarWidth = computed(() => (props.mobile ? '100vw' : '280px'))
const color = computed(() => getColor('background-secondary'))
const activeColor = computed(() => colorToRgba(getColor('focus'), 0.1))
const availableNavigationRoutes = filterRoutesByPermission(navigationRoutes.routes);

const iconColor = (route: INavigationRoute) => (routeHasActiveChild(route) ? 'primary' : 'secondary')
const textColor = (route: INavigationRoute) => (routeHasActiveChild(route) ? 'primary' : 'textPrimary')

watch(() => route.fullPath, setActiveExpand, { immediate: true })
</script>

<template>
  <VaSidebar v-model="writableVisible" :width="sidebarWidth" :color="color" minimized-width="0">
      <slot v-for="(route, index) in availableNavigationRoutes" :key="index">
        <VaSidebarItemContent v-if="route.children && route.children.length > 0" class="title-section">
          <VaSidebarItemTitle>
            {{ t(route.displayName) }}
          </VaSidebarItemTitle>
        </VaSidebarItemContent>

        <SidebarItem
          v-else
          :route="route"
          :active="routeHasActiveChild(route)"
          :active-color="activeColor"
          :text-color="textColor(route)"
          :icon-color="iconColor(route)"
          :has-permission="route.hasPermission || false"
        />

        <div v-if="route.children && route.children.length > 0" class="wrap-section-children">
          <div v-for="(childRoute, index2) in route.children" :key="index2">
            <SidebarItem
              :route="childRoute"
              :active="isActiveChildRoute(childRoute)"
              :active-color="activeColor"
              :text-color="textColor(childRoute)"
              :icon-color="iconColor(childRoute)"
              :has-permission="childRoute.hasPermission"
            />
          </div>
        </div>
      </slot>
  </VaSidebar>
</template>

<style lang="scss" scoped>
.va-sidebar {
  padding-top: 1rem;

  .va-sidebar__item__content {
    --va-sidebar-item-content-padding: 0.8rem 1rem 0.8rem 1rem;
 
    &.title-section {
      font-weight: bold;
      text-transform: uppercase;
      color: #b4b7be;
      min-height: 24px;
    }
  }
  .wrap-section-children {
    margin-bottom: 0.8rem;
  }
}
</style>

