<script setup>
import { onMounted } from 'vue';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

onMounted(() => {
  const msgArea = document.querySelector('.msg-area');

  msgArea.addEventListener('animationend', (e) => {
    if (e.animationName === 'fade-out') {
      msgArea.classList.remove('show');
    }
  });
});
</script>

<template>
  <div class="msg-area py-4 px-5 fs-5 border" :class="{ show: moneyStore.isMsgShow }">
    <p class="mb-0 text-center">
      <i class="fa-regular fa-circle-check me-2"></i>
      <template v-if="moneyStore.msgType === 'add'">新增成功</template>
      <template v-if="moneyStore.msgType === 'delete'">刪除成功</template>
      <template v-if="moneyStore.msgType === 'update'">修改成功</template>
    </p>
  </div>
</template>

<style>
.msg-area {
  display: none;

  position: fixed;
  z-index: 3;
  left: 6px;
  bottom: 12px;

  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
}

.msg-area.show {
  display: block;

  animation:
    fade-in 1s,
    fade-out 1s 3s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(calc(100% + 12px));
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(calc(100% + 12px));
  }
}
</style>
