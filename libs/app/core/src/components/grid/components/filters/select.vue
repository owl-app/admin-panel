<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'

import { useApi } from '../../../../composables/use-system'
import { isEqual } from 'lodash';

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
  valueBy: {
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
const model = defineModel<any[]>({ default: [] });

const api = useApi();
const { t } = useI18n()

const options = ref<any[]>([]);
const loading = ref(false);

loadData();

watch(
  ()=> [props.data],
  () => {
    const dataFromFilter = props.data?.split(',') ?? [];

    if (!isEqual(dataFromFilter, model.value)) {
      model.value = dataFromFilter;
    }
  },
);

watch(
  ()=> [props.url],
  async () => {
    await loadData();

    model.value = model.value.filter((option: any) => {
      return options.value.find(selected => selected[props.valueBy] === option);
    });

    props.changeFilter({
      [props.name]: model.value.join(','),
    });
  },
);

async function loadData() {
  loading.value = true;

  const result = await api.get(props.url);

  options.value = result.data?.items?.map(({ id, name }: { id: string, name: string }) => ({ id, name })) ?? [];

  loading.value = false;
}

function change() {
  props.changeFilter({
    [props.name]: Object.values(model.value).join(','),
  });
}

function clear() {
  model.value = [];
  props.removeFilter(props.name);
}
</script>

<template>
   <va-select
      v-model="model"
      searchable
      multiple
      background="#fff"
      :label="`${t(label)}`"
      :placeholder="`${t('select_option')}`"
      :options="options"
      :clearable="clearable"
      :text-by="textBy"
      :track-by="trackBy"
      :value-by="trackBy"
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
</template>