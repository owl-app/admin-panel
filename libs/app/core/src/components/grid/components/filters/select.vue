<script setup lang="ts">
import { onUnmounted, PropType, ref, Suspense, watch } from 'vue';
import { useI18n } from 'vue-i18n'

import { useApi } from '../../../../composables/use-system'

const api = useApi();
const { t } = useI18n()

const options = ref<any[]>([]);
const loading = ref(false);

const props = defineProps({
  data: {
    type: null as unknown as PropType<string | null>,
    required: true,
    nullable: true,
    default: null
  },
  url: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  textBy: {
    type: String,
    required: true,
  },
  trackBy: {
    type: String,
    required: true,
  },
  changeFilter: {
    type: Function as PropType<Function>,
    required: true,
  },
  removeFilter: {
    type: Function as PropType<Function>,
    required: true,
  },
  clearable: {
    type: Boolean,
    required: false,
    default: false
  },
});

defineEmits([
  'clear',
]);

const model = ref<any[]>([]);

await loadData();

watch(() => props.data, () => {
  model.value = options.value.filter((option: any) => {
    if (props.data?.split(',').includes(option[props.trackBy])) {
      return option;
    }
  });
}, { immediate: true });

async function loadData(): Promise<void> {
  loading.value = true;

  const result = await api.get(props.url);

  options.value = result.data?.items?.map(({ id, name }: { id: string, name: string }) => ({ id, name })) ?? [];

  loading.value = false;
}

onUnmounted(() => {
  console.log('test')
  model.value = [];
});

function change() {
  props.changeFilter({
    [props.name]: (model.value.map((item: any) => item[props.trackBy])).join(','),
  });
}

function clear() {
  model.value = [];
  props.removeFilter(props.name);
}
</script>

<template>
  <Suspense>
   <va-select
      v-model="model"
      searchable
      multiple
      background="#fff"
      :label="`${t(label)}`"
      :placeholder="`${t('select_option')}`"
      :options="options"
      :clearable="clearable"
      :text-by="(option: any) => option.name"
      :track-by="(option: any) => option.id"
      :loading="loading"
      @clear="clear"
      @update:isOpen="(isOpen: boolean) => !isOpen && change()"
    >
      <template #content="{ valueArray }">
        <va-badge
          v-for="v in valueArray"
          :class="`mr-0.5 mt-0.5 ${v.archived ? 'line-through' : ''}`"
          :color="v.color ?? 'primary'"
          :text="v.name"
          :key="v"
        />
      </template>
    </va-select>
  </Suspense>
</template>