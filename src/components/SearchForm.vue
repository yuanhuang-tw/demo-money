<script setup>
import { ref } from 'vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

// firestore
import db from '@/firebase/init.js';
import { collection, query, onSnapshot, getCountFromServer } from 'firebase/firestore';

// sweetalert
import swal from 'sweetalert';

const year = ref('');
const month = ref('');

const search = () => {
  if (!validateForm(year.value, month.value)) {
    return;
  }

  moneyStore.isSearchLoading = true;
  moneyStore.isPieLoaded = false;
  moneyStore.searchYearMonth = `${year.value}-${month.value}`;

  moneyStore.searchDataCount = 0;
  getCountData();

  const q = query(collection(db, `${year.value}-${month.value}`));

  onSnapshot(
    q,
    (snapshot) => {
      year.value = '';
      month.value = '';
      moneyStore.searchData.length = 0;

      snapshot.docs.forEach((doc) => {
        moneyStore.searchData.push({
          id: doc.id,
          date: doc.data().date,
          type: doc.data().type,
          item: doc.data().item,
          price: doc.data().price,
          note: doc.data().note,
          timestamp: doc.data().timestamp
        });
      });

      moneyStore.isSearchLoading = false;
    },
    (err) => console.error(err)
  );
};

async function getCountData() {
  const countData = await getCountFromServer(collection(db, `${year.value}-${month.value}`));
  moneyStore.searchDataCount = countData.data().count;
}

function validateForm(year, month) {
  if (!year) {
    sweetAlert('年');
    return false;
  }

  if (!month) {
    sweetAlert('月');
    return false;
  }

  return true;
}

function sweetAlert(field) {
  swal({
    title: 'Error',
    text: `請輸入${field}`,
    icon: 'error'
  });
}
</script>

<template>
  <section class="section mb-4 p-4">
    <form class="form" @submit.prevent="search()">
      <!-- 年 -->
      <div class="mb-3">
        <label class="form-label fw-bold" for="year">年</label>
        <input class="form-control" id="year" type="text" v-model.trim="year" />
      </div>

      <!-- 月 -->
      <div class="mb-4">
        <label class="form-label fw-bold" for="month">月</label>
        <select class="form-select" id="month" v-model="month">
          <option disabled value="">請選擇</option>
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary px-5">查詢</button>
    </form>
  </section>
</template>
