<script setup lang="ts">
import { computed, PropType, ref, Ref } from 'vue'
import { DataTableColumnSource } from 'vuestic-ui/web-components';
import { useItems } from './composables/useItems';
import type { PageHeader } from './types';

const props = defineProps({
  pageHeader: {
    type: Object as PropType<PageHeader>,
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
  //   sortBy: {
  //     type: Object as PropType<Sorting['sortBy']>,
  //     required: true,
  //   },
  //   sortingOrder: {
  //     type: Object as PropType<Sorting['sortingOrder']>,
  //     required: true,
  //   },
})
const page = ref(1);
const limit = ref(props.defaultLimit);
const sort = ref([props.defaultSort]);
const filter = ref({});

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
const changeFilter = (event: { target: HTMLInputElement; } ) => {
  filter.value = { email: event.target.value};
}
</script>

<template>
  <div class="page-header">
    <h1 v-if="pageHeader?.title">{{ pageHeader.title }}</h1>
  </div>
  <va-card style="margin-bottom: 10px;">
    <va-card-content>
      <va-collapse
          :v-model="false"
          class="min-w-96"
          header="Filters"
          icon="home"
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
.page-header {
  display: flex;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 20px 0 20px 0;
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