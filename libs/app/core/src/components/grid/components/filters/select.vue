<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'

import { useApi } from '../../../../composables/use-system'

const api = useApi();
const { t } = useI18n()

const options = ref<unknown[]>([]);
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
])

const model = ref([]);

loadData();

async function loadData(): Promise<void> {
  loading.value = true;
  const result = await api.get(props.url);

  options.value = result.data?.items?.map(({ id, name }: { id: string, name: string }) => ({ id, name })) ?? [];

  model.value = options.value.filter((option: any) => {
    if (props.data?.split(',').includes(option[props.trackBy])) {
      return option;
    }
  });

  loading.value = false;
}

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
   <va-select
      v-model="model"
      searchable
      multiple
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
</template>