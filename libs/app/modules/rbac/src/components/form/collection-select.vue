<script setup lang="ts">
import { AvalilableCollections } from '@owl-app/lib-contracts';
import { useI18n } from 'vue-i18n'

const model = defineModel<string>();

const { t } = useI18n()

const options = [
    AvalilableCollections.CLIENT,
    AvalilableCollections.USER,
    AvalilableCollections.ROLE,
    AvalilableCollections.PERMISSION,
];
</script>

<template>
   <VaSelect
      v-model="model"
      :label="`${t('collection')}`"
      :placeholder="`${t('select_option')}`"
      :options="options"
    />
</template>