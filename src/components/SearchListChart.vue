<script setup>
import { watch, nextTick, onMounted } from 'vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

// chart.js
import Chart from 'chart.js/auto';

let chart;

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

const showChart = async () => {
  await nextTick();

  const ctx = document.getElementById('my-chart');

  const config = {
    type: 'pie',
    data: {
      labels: Object.keys(moneyStore.pieObj),
      datasets: [
        {
          data: moneyStore.pieObjPriceArray,
          backgroundColor: Object.keys(moneyStore.pieObj).map((_, i) => COLORS[i % COLORS.length])
        }
      ]
    }
  };

  if (chart) {
    chart.destroy();
    chart = new Chart(ctx, config);
  } else {
    chart = new Chart(ctx, config);
  }

  moneyStore.isPieLoaded = true;
};

watch([() => moneyStore.sortedSearchData, () => moneyStore.searchDataCount], (newVal) => {
  const [sortedSearchData, searchDataCount] = newVal;

  if (
    !moneyStore.isPieLoaded &&
    sortedSearchData.length > 0 &&
    sortedSearchData.length === searchDataCount
  ) {
    showChart();
  }
});

watch(
  () => moneyStore.pieObjPriceArray,
  (newVal) => {
    if (moneyStore.isPieLoaded && newVal.length > 0) {
      showChart();
    }
  }
);

onMounted(() => {
  if (moneyStore.pieObjPriceArray.length && moneyStore.searchDataCount) {
    showChart();
  }
});
</script>

<template>
  <canvas class="mb-4" id="my-chart"></canvas>
</template>
