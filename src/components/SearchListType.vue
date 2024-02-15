<script setup>
import { computed } from 'vue';

// component
import AccordionList from '@/components/AccordionList.vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

const COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
];

const arr = computed(() => Object.keys(moneyStore.pieObj));
</script>

<template>
  <ul class="type-list mb-0 list-unstyled">
    <li
      v-for="(item, idx) in arr"
      :key="item"
      class="position-relative"
      :class="{ 'mb-5': idx !== arr.length - 1 }"
    >
      <p class="text-center">
        <i class="fa-solid fa-hashtag"></i>
        <span
          class="fs-2 border-bottom border-2 ms-1"
          :style="`border-color: ${COLORS[idx]} !important`"
        >
          <span class="fw-bold">{{ item }}</span>
          <span class="twd text-secondary ms-2">TWD</span>
          <span class="fs-5 ms-1">
            {{ moneyStore.pieObj[item].price.toLocaleString() }}
          </span>
        </span>
      </p>

      <AccordionList :data="moneyStore.pieObj[item].items" :modal-id="idx" />
    </li>
  </ul>
</template>

<style scoped>
.fa-hashtag {
  position: relative;
  top: -6px;
}
</style>
