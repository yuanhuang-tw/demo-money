<script setup>
// component
import AccordionList from '@/components/AccordionList.vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();
</script>

<template>
  <div class="mt-3" id="swipe-area">
    <AccordionList :data="moneyStore.activeDateDetailArray" />
    <p class="fs-5 text-center mt-4 mb-0">當天花費：{{ moneyStore.activeDateTotalPrice }}</p>
  </div>
</template>
