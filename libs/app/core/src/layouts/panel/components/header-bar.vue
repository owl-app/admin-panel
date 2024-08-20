<script setup lang="ts">
export interface Props {
  title?: string;
  description?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), { });
</script>

<template>
<div class="grid grid-cols-2 gap-2">
  <div class="header-bar">
    <div class="header-icon">
        <va-icon class="material-symbols-outlined" :name="icon" :size="30" color="#158DE3" />
    </div>

    <div class="title">
      <h1 v-if="title">{{ title }}</h1>
      <div class="description" v-if="description">{{ description }}</div>
    </div>
  </div>
  <div class="content-top header-actions ">
    <slot name="actions"></slot>
  </div>
</div>

</template>

<style lang="scss" scoped>
.header-bar {
  --header-bar-height: 60px;

  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: flex-start;

  .title {
    h1 {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .description {
      font-size: 0.8rem;
      font-weight: 400;
      color: #878d99;
      margin-top: 0.3rem;

      line-height: 0.7rem;
    }
  }

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d9efff;
    border-radius: 50%;
    height: var(--v-header-bar-icon-height, 50px);
    width: var(--v-header-bar-icon-width, 50px);
    margin-right: 1rem;
  }
}
.header-actions {
  text-align: right;
}
</style>