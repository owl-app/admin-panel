<script setup lang="ts">
import { reactive, PropType } from 'vue'
import { isEmpty } from "@owl-app/utils";

export type SelectTypeOption = {
  value:string,
  text?: string
}

const props = defineProps({
  value: {
    type: Object as PropType<{ type: string, value: string }>,
    required: true,
    default: () => ({ type: 'equal', value: '' }),
  },
  changeFilter: {
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
    type: { value: props.value?.type, text: types.filter(t => t.value === props.value?.type)[0]?.text },
    text: props.value?.value,
});

function change(field: string) {
  const { type , text } = form;

  if (
    field === 'type' && isEmpty(text) || 
    (!['not_empty', 'empty'].indexOf(type.value) && isEmpty(text))
  ) 
    return;

  props.changeFilter({
    search: {
      type: type?.value,
      value: text
    }
  });
}

</script>

<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="flex flex-col md6">
      <div class="item">
        <va-select
          v-model="form.type"
          :options="types"
          label="Type"
          @update:modelValue="change('type')"
        />
      </div>
    </div>
    <div class="flex flex-col md6">
      <div class="item">
        <va-input
          v-model="form.text"
          label="Search text"
          @update:modelValue="change('text')"
        />
      </div>
    </div>
  </div>
</template>