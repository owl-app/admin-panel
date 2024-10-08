<script setup lang="ts">
import { debounce, DebouncedFunc } from 'lodash';
import { reactive, watch, PropType } from 'vue';
import { isEmpty } from "@owl-app/utils";

export type SelectTypeOption = {
  value:string,
  text?: string
}

const props = defineProps({
  data: {
    type: Object as PropType<{ type: string, value: string }>,
    required: true,
    default: () => ({ type: 'equal', value: '' }),
  },
  changeFilter: {
    type: Function as PropType<Function>,
    required: true,
  },
  removeFilter: {
    type: Function as PropType<Function>,
    required: true,
  },
});

const types = [
  { value: 'equal', text: 'Equal' },
  { value: 'not_equal', text: 'Not equal' },
  { value: 'empty', text: 'Empty' },
  { value: 'not_empty', text: 'Not empty' },
  { value: 'contains', text: 'Contains' },
  { value: 'not_contains', text: 'Not contains' },
  { value: 'starts_with', text: 'Starts with' },
  { value: 'ends_with', text: 'Ends with' },
  { value: 'in', text: 'In' },
  { value: 'not_in', text: 'Not in' },
]

const form: { type: SelectTypeOption, text: string } = reactive({
    type: { value: props.data?.type, text: types.filter(t => t.value === props.data?.type)[0]?.text },
    text: props.data?.value,
});

let textDebounce: DebouncedFunc<(...args: any[]) => any>;

watch(() => props.data, () => {
  form.type = { value: props.data?.type, text: types.filter(t => t.value === props.data?.type)[0]?.text };
  form.text = props.data?.value;
}, { immediate: true });

function change(field: string) {
  const { type , text } = form;

  if(textDebounce) {
    textDebounce.cancel();
  }

  if (
    isEmpty(text) &&
    (!['not_empty', 'empty'].includes(type.value))
  ) {
    if (field === 'text') props.removeFilter('search');

    return
  }

  if (field === 'text') {
    textDebounce = debounce(() => {
      props.changeFilter({
        search: {
          type: type?.value,
          value: text
        }
      });
    }, 500);

    textDebounce();
  } else {
    props.changeFilter({
      search: {
        type: type?.value,
        value: text
      }
    });
  }
}

function clear() {
  form.text = '';
  form.type = { value: 'equal', text: 'Equal' };
  props.removeFilter('search');
}

</script>

<template>
  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-11">
        <div class="grid grid-cols-2 gap-2">
          <va-select
            v-model="form.type"
            :options="types"
            label="Type"
            @update:modelValue="change('type')"
          />

          <va-input
            v-model="form.text"
            label="Search text"
            @update:modelValue="change('text')"
          />
        </div>
    </div>
    <div class="clear">
      <button @click="clear">
        <va-icon class="material-symbols-outlined" name="close" size="small" color="danger" />
      </button>
  </div>
  </div>
</template>

<style lang="scss" scoped>
:deep() {
  .clear {
    display: flex;
    align-items: end;
    width:100%;
    justify-content: left;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: .125rem solid var(--va-danger);
      font-weight: bold;
      margin-bottom: .4rem;
    }
  }
}
</style>