<script setup lang="ts">
import { computed, PropType, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { DataTableColumnSource } from 'vuestic-ui/web-components';

import HeaderBar, { type Props as HeaderBarProps } from '../../layouts/panel/components/header-bar.vue';

import { useItems } from './composables/useItems';
import { isEqual } from 'lodash';

const props = defineProps({
  headerBar: {
    type: Object as PropType<HeaderBarProps>,
    required: false,
  },
  columns: {
    type: Array as PropType<DataTableColumnSource[]>,
    required: true,
  },
  defaultLimit: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  defaultSort: {
    type: String as PropType<string>,
    required: true,
  },
})
const router = useRouter();
const route = useRoute();

const { sort, limit, page, filter } = useItemOptions();

const {
    items,
    loading,
    totalPages,
    totalCount,
  } = useItems('users', {
    limit,
    page,
    sort,
    filter
  });

const showingFrom = computed(() => {
  if(page.value > 1 ) {
    return limit.value * (page.value - 1);
  }

  return 1;
});

const showingTo = computed(() => {
  const to: number = limit.value * page.value;

  if(to > (totalCount?.value ?? 0)) {
    return totalCount;
  }

  return to;
});

watch(
  [limit, sort, filter, page],
  async (after, before) => {
    if (isEqual(after, before)) return;

    const [newLimit, newSort, newFilter, newPage] = after;
    const [oldLimit, oldSort, oldFilter, oldPage] = before;

    if(newPage !== oldPage) {
      router.push({ query: { ...route.query, page: page.value } });
    }

    if(newLimit !== oldLimit) {
      router.push({ query: { ...route.query, limit: limit.value } });
    }

    if(!isEqual(newFilter, oldFilter)) {
      router.push({ query: { ...route.query, ...filter.value } });
    }
  },
  { deep: true, immediate: true }
);

function changeFilter (event: { target: HTMLInputElement; } ) {
  filter.value = { email: event.target.value};
}

function useItemOptions() {
  const page = ref(route.query.page ? parseInt(route.query.page as string) : 1);
  const limit = ref(route.query.limit ? parseInt(route.query?.limit as string) : props.defaultLimit);
  const sort = ref([props.defaultSort]);
  const filter = ref({});

  return { sort, limit, page, filter };
}

</script>

<template>
  <header-bar
    :title="headerBar?.title"
    :description="headerBar?.description"
    :icon="headerBar?.icon"
  />

  <va-card style="margin-bottom: 10px;">
    <va-card-content>
      <va-collapse
          :v-model="false"
          class="min-w-96"
          header="Filters"
          icon="filter_list"
        >
        <slot
          name="filters"
          :filters="filter"
          :change-filter="changeFilter"
        />
      </va-collapse>
    </va-card-content>
  </va-card>

  <va-card>
    <va-card-content>
      <va-data-table
        :items="items"
        :columns="columns"
        :loading="loading"
        :per-page="limit"
      >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </va-data-table>

      <div class="wrapper-bottom">
        <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-top py-2">
          <div>
            Results per page
            <VaSelect v-model="limit" class="!w-20" :options="[10, 50, 100]" />
          </div>
          <div v-if="totalPages > 1" class="flex">
            <va-button
              preset="secondary"
              icon="va-arrow-left"
              aria-label="Previous page"
              :disabled="page === 1"
              @click="page--"
            />
            <va-button
              class="mr-2"
              preset="secondary"
              icon="va-arrow-right"
              aria-label="Next page"
              :disabled="page === totalPages"
              @click="page++"
            />
            <va-pagination
              v-model="page"
              buttons-preset="secondary"
              :pages="totalPages"
              :visible-pages="limit"
              :boundary-links="false"
              :direction-links="false"
            />
          </div>
        </div>
        <div class="count-results" v-if="items.length > 0">
          <b>Showing {{ showingFrom }} - {{ showingTo }} of {{ totalCount }} results</b>
        </div>
      </div>

    </va-card-content>
  </va-card>
</template>
<style lang="scss">
.va-collapse {
  &__body-wrapper {
    &--bordered {
      border-bottom: 0;
    }
  }

  &__header {
    padding: 0;
  }
}
.wrapper-bottom {
  padding-top: 0.8rem;
  border-top: 1px solid var(--va-background-border);

  .count-results {
    text-align: right;
    margin-top: 0.5rem;
  }
}
</style>