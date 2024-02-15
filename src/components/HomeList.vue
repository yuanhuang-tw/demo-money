<script setup>
import { ref, watch, nextTick } from 'vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

// component
import HomeListChart from '@/components/HomeListChart.vue';
import HomeListActiveDate from '@/components/HomeListActiveDate.vue';

// firestore
import db from '@/firebase/init.js';
import { collection, where, query, onSnapshot } from 'firebase/firestore';

const today = new Date();
const DAYS_NUMBER = 7;

const updatedDateArrayIndex = ref(0);
const updatedTotalPrice = ref(0);

// 迴圈取得今天及前六天的日期和資料
for (let i = 0; i < DAYS_NUMBER; i++) {
  const currentDate = new Date(today);

  // 設定日期為今天減去 i 天
  currentDate.setDate(today.getDate() - i);

  const year = currentDate.getFullYear();

  // 月份從 0 開始，所以要加 1，並確保兩位數
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');

  // 確保日期為兩位數
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const q = query(collection(db, formattedDate.slice(0, 7)), where('date', '==', formattedDate));

  onSnapshot(
    q,
    (snapshot) => {
      moneyStore.sevenDateObj[formattedDate] = {};
      let totalPrice = 0;

      moneyStore.sevenDateObj[formattedDate].detail = snapshot.docs.map((doc) => {
        totalPrice += doc.data().price;

        return {
          id: doc.id,
          date: doc.data().date,
          type: doc.data().type,
          item: doc.data().item,
          price: doc.data().price,
          note: doc.data().note,
          timestamp: doc.data().timestamp
        };
      });

      moneyStore.sevenDateObj[formattedDate].totalPrice = totalPrice;

      if (isLoading.value === false) {
        updatedDateArrayIndex.value = moneyStore.sevenDateArray.indexOf(formattedDate);
        updatedTotalPrice.value = totalPrice;
      }
    },
    (err) => console.error(err)
  );
}

const isLoading = ref(true);

watch(moneyStore.sevenDateObj, (newObj) => {
  if (Object.keys(newObj).length === DAYS_NUMBER) {
    isLoading.value = false;
  }
});

watch(isLoading, (newVal) => {
  if (!newVal && window.innerWidth < 1024) {
    getSwipeArea();
  }
});

// hammer
const getSwipeArea = async () => {
  await nextTick();

  const swipeArea = document.getElementById('swipe-area');

  const hammertime = new Hammer(swipeArea);

  hammertime.on('swipeleft', function () {
    if (0 < moneyStore.activeDateIndex) {
      moneyStore.changeDate(-1);
    }
  });

  hammertime.on('swiperight', function () {
    if (moneyStore.activeDateIndex < DAYS_NUMBER - 1) {
      moneyStore.changeDate(1);
    }
  });
};

const getDayOfWeek = (dateString) => {
  const dateObject = new Date(dateString);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return daysOfWeek[dateObject.getDay()];
};
</script>

<template>
  <section class="section p-4">
    <div class="text-center" v-if="isLoading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <template v-else>
      <HomeListChart
        :updated-date-array-index="updatedDateArrayIndex"
        :updated-total-price="updatedTotalPrice"
        :days-number="DAYS_NUMBER"
      />

      <div class="text-center mt-4">
        <button
          class="btn btn-light me-3 px-3"
          type="button"
          title="前一天"
          :disabled="moneyStore.activeDateIndex === DAYS_NUMBER - 1"
          @click="moneyStore.changeDate(1)"
        >
          <i class="fa-solid fa-angle-left"></i>
        </button>

        <span class="fs-5">
          {{ moneyStore.sevenDateArray[moneyStore.activeDateIndex] }}
          <span class="week">
            ({{ getDayOfWeek(moneyStore.sevenDateArray[moneyStore.activeDateIndex]) }})
          </span>
        </span>

        <button
          class="btn btn-light ms-3 px-3"
          type="button"
          title="後一天"
          :disabled="moneyStore.activeDateIndex === 0"
          @click="moneyStore.changeDate(-1)"
        >
          <i class="fa-solid fa-angle-right"></i>
        </button>
      </div>

      <HomeListActiveDate />
    </template>
  </section>
</template>

<style scoped>
.week {
  font-size: 0.875rem;
}
</style>
