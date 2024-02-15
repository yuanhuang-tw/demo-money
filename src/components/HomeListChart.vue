<script setup>
import { watch, nextTick } from 'vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

const props = defineProps({
  updatedDateArrayIndex: Number,
  updatedTotalPrice: Number,
  daysNumber: Number
});

// chart.js
import Chart from 'chart.js/auto';

let chart;

watch(
  () => moneyStore.sevenDateTotalPriceArray,
  () => {
    if (chart) {
      chart.data.datasets[0].data[props.daysNumber - 1 - props.updatedDateArrayIndex] =
        props.updatedTotalPrice;

      chart.update();
    }
  }
);

const showChart = async () => {
  await nextTick();

  const ctx = document.getElementById('my-chart');

  const config = {
    type: 'bar',
    data: {
      labels: [...moneyStore.sevenDateArray].reverse(),
      datasets: [
        {
          label: '花費金額',
          data: [...moneyStore.sevenDateTotalPriceArray].reverse()
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  if (chart) {
    chart.destroy();
    chart = new Chart(ctx, config);
  } else {
    chart = new Chart(ctx, config);
  }
};

showChart();
</script>

<template>
  <p class="fs-5 text-center">最近七天花費金額</p>

  <canvas id="my-chart"></canvas>
</template>
