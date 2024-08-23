<script lang="ts" setup>
import { computed, ref, watch, VNode, Fragment } from 'vue'
import { debounce, DebouncedFunc } from 'lodash';
import * as v from 'valibot'
import { BaseSchema } from 'valibot'
import { useForm } from 'vuestic-ui'

import type { Item, PrimaryKey } from '../../types/item';
import { useItem } from '../../composables/use-item';

const props = defineProps<{
  collection: string,
  schema?: BaseSchema,
  primaryKey?: PrimaryKey | undefined,
  defaultValue?: Item | null,
  classForm?: string,
}>()

const emit = defineEmits<{
  (event: 'saved', dataSaved: any): void
}>()

const dataForm = ref({ ...props.defaultValue ?? {} })
const validationErrors = ref<any>({})
const { primaryKey, item, loading, saving, getItem, save } = useItem<Item>(props.collection, props.primaryKey);
const { fields } = useForm('owl-form')
const isValid = ref(!props?.schema);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(dataForm.value).some((key) => {
    return (
      dataForm.value[key as keyof Item] !== (item.value ?? props.defaultValue)?.[key as keyof Item]
    )
  })
})

let immediateValidation = false;
let textDebounce: DebouncedFunc<(...args: any[]) => any>;

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.primaryKey,
  async () => {
    if (!props.primaryKey) {
      primaryKey.value = null;
      validate();
      return;
    }

    primaryKey.value = props.primaryKey;
    await getItem();

    immediateValidation = true;

    dataForm.value = {
      ...item.value,
    }
  },
  { immediate: true },
)
watch(
  [dataForm],
  () => {
    if (immediateValidation) {
      validate();
      immediateValidation = false;
    } else {
      debouceValidate(1000);
    }
  },
  { deep: true },
)

const getUnSlottedVNodes = (nodes: VNode[]) => {
  if (Array.isArray(nodes) && nodes[0].type === Fragment) {
    // If passed as slot, ignore Fragment VNode (template #default)
    return nodes[0].children as VNode[]
  }

  return nodes
}

const getVNodeKey = (node: VNode): string => {
  if (typeof node.type === 'string') {
    return node.type
  }

  if (typeof node.type === 'object' && 'name' in node.type && typeof node.type.name === 'string') {
    return node.type.name
  }

  return String(node.key)
}

const getVNodeComponentName = (node: VNode) => {
  if (typeof node.type === 'object' && 'name' in node.type && typeof node.type.name === 'string') {
    return node.type.name
  }

  return ''
}

function validate(showAllErrors = false): boolean {
  if(!props.schema) return true;

  if(textDebounce) {
    textDebounce.cancel();
  }

  const result = v.safeParse(props.schema, { ...dataForm.value });

  if (result.issues) {
    const flattenResult = v.flatten(result.issues)?.nested ?? {}
    let errors = {};
  
    fields.value.map((field) => {
      if (
        (field.isDirty || field.isTouched || showAllErrors) &&
        field.name !== undefined && Object.keys(flattenResult).includes(field.name)
      ) {
        if(showAllErrors) {
          field.isTouched = true;
        }

        errors = { ...errors, ...{ [field.name]: flattenResult[field.name] }};
      }
    })

    validationErrors.value = errors;
    isValid.value = false;

    return false;
  } else {
    validationErrors.value = {};
    isValid.value = true;

    return true;
  }
}

function debouceValidate(time: number) {
  if(textDebounce) {
    textDebounce.cancel();
  }

  textDebounce = debounce(() => {
    validate();
  }, time);

  textDebounce();
}

const saveForm = async () => {
  delete dataForm.value?.id
  const savedData = await save(dataForm.value);
  dataForm.value = {}
  emit('saved', savedData);
}
</script>

<template>
  <VaInnerLoading :loading="loading || saving">
    <va-form 
      ref="owl-form"
      :class="classForm"
    >
      <template v-for="child in getUnSlottedVNodes($slots.fields({data: dataForm, validation: validationErrors }))" :key="getVNodeKey(child)">
        <component 
          v-if="getVNodeComponentName(child) === 'VaTextarea' || 'VaInput'"
          :is="child" @focusout="$event.stopPropagation(); validate();" 
        />
        <component v-else :is="child" />
      </template>

      <slot
        name="actions"
        :validate="validate"
        :save="saveForm"
        :is-valid="isValid"
        :is-loading="loading || saving"
        :data="dataForm"
      />
    </va-form>
  </VaInnerLoading>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
