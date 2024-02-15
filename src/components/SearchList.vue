<script setup>
import { ref } from 'vue';

// component
import SearchListChart from '@/components/SearchListChart.vue';
import SearchListType from '@/components/SearchListType.vue';
import SearchListDate from '@/components/SearchListDate.vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

// tab
const picked = ref('SearchListType');

const tabs = {
  SearchListType,
  SearchListDate
};
</script>

<template>
  <section class="section p-4" v-if="moneyStore.searchYearMonth">
    <p class="fs-1 text-center mb-1">{{ moneyStore.searchYearMonth }}</p>

    <div class="text-center mt-3" v-if="moneyStore.isSearchLoading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <template v-if="moneyStore.sortedSearchData.length > 0">
        <div class="d-flex justify-content-center gap-3 text-secondary mb-4">
          <span>
            <b>{{ moneyStore.sortedSearchData.length }}</b> 筆花費紀錄
          </span>
          <span>
            花費金額 <b>{{ moneyStore.monthTotalPrice.toLocaleString() }}</b>
          </span>
        </div>

        <SearchListChart />

        <div class="text-center mb-4">
          <div class="btn-group" role="group">
            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btnradio1"
              autocomplete="off"
              value="SearchListType"
              v-model="picked"
            />
            <label class="btn btn-outline-primary" for="btnradio1">類別</label>

            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btnradio2"
              autocomplete="off"
              value="SearchListDate"
              v-model="picked"
            />
            <label class="btn btn-outline-primary" for="btnradio2">日期</label>
          </div>
        </div>

        <component :is="tabs[picked]"></component>
      </template>

      <p class="fs-5 text-center mb-0" v-else>無資料</p>
    </template>
  </section>
</template>
