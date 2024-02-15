<script setup>
import { ref } from 'vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

// firestore
import db from '@/firebase/init.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// sweetalert
import swal from 'sweetalert';

// form
const date = ref('');
const type = ref('');
const item = ref('');
const price = ref('');
const note = ref('');
const isBtnDisabled = ref(false);

const add = async () => {
  if (!validateForm(date.value, type.value, item.value, price.value)) {
    return;
  }

  isBtnDisabled.value = true;

  try {
    const colName = date.value.slice(0, 7);

    await addDoc(collection(db, colName), {
      date: date.value,
      type: type.value,
      item: item.value,
      price: price.value,
      note: note.value,
      timestamp: serverTimestamp()
    });

    date.value = '';
    type.value = '';
    item.value = '';
    price.value = '';
    note.value = '';

    const form = document.querySelector('.form');

    for (const ele of form.elements) {
      ele.blur();
    }

    isBtnDisabled.value = false;

    moneyStore.isMsgShow = true;
    moneyStore.msgType = 'add';

    setTimeout(() => {
      moneyStore.isMsgShow = false;
      moneyStore.msgType = '';
    }, 5000);
  } catch (err) {
    console.error(err);
  }
};

function validateForm(date, type, item, price) {
  if (!date) {
    sweetAlert('日期');
    return false;
  }

  if (!type) {
    sweetAlert('類別');
    return false;
  }

  if (!item) {
    sweetAlert('項目');
    return false;
  }

  if (!price) {
    sweetAlert('價格');
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
  <section class="section mb-4 p-4" v-if="moneyStore.isLogin">
    <form class="form" @submit.prevent="add()">
      <!-- 日期 -->
      <div class="mb-3">
        <label class="form-label fw-bold" for="date">日期</label>
        <input class="form-control" id="date" type="date" v-model.trim="date" />
      </div>

      <!-- 類別 -->
      <div class="mb-3">
        <label class="form-label fw-bold" for="type">類別</label>
        <select class="form-select" id="type" v-model="type">
          <option disabled value="">請選擇</option>
          <option>食</option>
          <option>衣</option>
          <option>住</option>
          <option>行</option>
          <option>育</option>
          <option>樂</option>
          <option>其他</option>
        </select>
      </div>

      <!-- 項目 -->
      <div class="mb-3">
        <label class="form-label fw-bold" for="item">項目</label>
        <input class="form-control" id="item" type="text" v-model.trim="item" />
      </div>

      <!-- 價格 -->
      <div class="mb-3">
        <label class="form-label fw-bold" for="price">價格</label>
        <input class="form-control" id="price" type="number" min="0" v-model.number.trim="price" />
      </div>

      <!-- 備註 -->
      <div class="mb-4">
        <label class="form-label fw-bold" for="note">備註</label>
        <textarea
          class="form-control"
          id="note"
          style="height: 80px"
          v-model.trim="note"
        ></textarea>
      </div>

      <button
        type="submit"
        class="btn btn-primary px-5"
        :class="{ 'not-allowed': isBtnDisabled }"
        :disabled="isBtnDisabled"
      >
        新增
      </button>
    </form>
  </section>
</template>

<style scoped>
.not-allowed {
  cursor: not-allowed !important;
  pointer-events: auto !important;
}
</style>
