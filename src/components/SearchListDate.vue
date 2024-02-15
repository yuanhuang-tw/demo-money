<script setup>
// component
import AccordionList from '@/components/AccordionList.vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();
</script>

<template>
  <AccordionList :data="moneyStore.sortedSearchData" />
</template>
