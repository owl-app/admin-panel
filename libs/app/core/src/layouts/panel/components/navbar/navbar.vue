<template>
  <VaNavbar class="app-layout-navbar py-3 px-0">
    <template #left>
      <div class="left">
        <Transition v-if="isMobile" name="icon-fade" mode="out-in">
          <VaIcon
            color="primary"
            :name="isSidebarMinimized ? 'menu' : 'close'"
            size="24px"
            style="margin-top: 3px"
            @click="isSidebarMinimized = !isSidebarMinimized"
          />
        </Transition>
        <RouterLink to="/dashboard" aria-label="Owl">
          <div class="logo-bar">
            <VuesticLogo /> OWL
          </div>
        </RouterLink>
      </div>
    </template>
    <template #right>
      <AppNavbarActions class="app-navbar__actions" :is-mobile="isMobile" />
    </template>
  </VaNavbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../../../stores/app'
import VuesticLogo from '../../../../components/logo-black.vue'
import AppNavbarActions from './components/AppNavbarActions.vue'

defineProps({
  isMobile: { type: Boolean, default: false },
})

const appStore = useAppStore()

const { isSidebarMinimized } = storeToRefs(appStore)
</script>

<style lang="scss" scoped>
.va-navbar {
  z-index: 2;
  -webkit-box-shadow: 0px 9px 16px -16px rgba(66, 68, 90, 1);
  -moz-box-shadow: 0px 9px 16px -16px rgba(66, 68, 90, 1);
  box-shadow: 0px 9px 16px -16px rgba(66, 68, 90, 1);

  @media screen and (max-width: 950px) {
    .left {
      width: 100%;
    }

    .app-navbar__actions {
      display: flex;
      justify-content: space-between;
    }
  }

  .logo-bar {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;

    img {
      height: 40px;
      margin-right: 0.5rem;
    }
  }
}

.left {
  display: flex;
  align-items: center;
  margin-left: 1rem;

  & > * {
    margin-right: 1rem;
  }

  & > *:last-child {
    margin-right: 0;
  }
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: transform 0.5s ease;
}

.icon-fade-enter,
.icon-fade-leave-to {
  transform: scale(0.5);
}
</style>
