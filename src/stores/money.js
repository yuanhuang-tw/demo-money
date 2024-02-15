import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';

// firestore
import { auth } from '@/firebase/init.js';
import { onAuthStateChanged } from 'firebase/auth';

export const useMoneyStore = defineStore('money', () => {
  // login
  const isLoginOutShow = ref(false);
  const isLogin = ref(false);

  onAuthStateChanged(auth, (user) => {
    isLoginOutShow.value = true;

    if (user) {
      isLogin.value = true;
    } else {
      isLogin.value = false;
    }
  });

  // msg
  const isMsgShow = ref(false);
  const msgType = ref('');

  // search
  const searchYearMonth = ref('');
  const searchData = reactive([]);
  const searchDataCount = ref(0);
  const isSearchLoading = ref(true);
  const isPieLoaded = ref(false);

  // 日期排序 大 -> 小
  const sortedSearchData = computed(() => {
    return [...searchData].sort((a, b) => {
      if (b.date > a.date) {
        return 1;
      }

      if (a.date > b.date) {
        return -1;
      }

      return 0;
    });
  });

  const pieObj = computed(() => {
    const tempObj = {};

    sortedSearchData.value.forEach((item) => {
      if (!tempObj[item.type]) {
        tempObj[item.type] = {};
        tempObj[item.type].price = item.price;

        tempObj[item.type].items = [];
        tempObj[item.type].items.push(item);
      } else {
        tempObj[item.type].price += item.price;
        tempObj[item.type].items.push(item);
      }
    });

    return tempObj;
  });

  const pieObjPriceArray = computed(() => {
    return Object.keys(pieObj.value).map((key) => pieObj.value[key].price);
  });

  const monthTotalPrice = computed(() => {
    return pieObjPriceArray.value.reduce((sum, item) => sum + item, 0);
  });

  // { YYYY-MM-DD: { detail: Array, totalPrice: Number } }
  const sevenDateObj = reactive({});

  const activeDateIndex = ref(0);

  const sevenDateArray = computed(() => {
    return Object.keys(sevenDateObj).sort((a, b) => new Date(b) - new Date(a));
  });

  const sevenDateTotalPriceArray = computed(() => {
    return sevenDateArray.value.map((d) => sevenDateObj[d].totalPrice);
  });

  const activeDateDetailArray = computed(() => {
    const tempDate = sevenDateArray.value[activeDateIndex.value];
    const tempArr = sevenDateObj[tempDate]?.detail || [];

    return [...tempArr].sort((a, b) => b.timestamp - a.timestamp);
  });

  const activeDateTotalPrice = computed(() => {
    return sevenDateObj[sevenDateArray.value[activeDateIndex.value]]?.totalPrice.toLocaleString();
  });

  const activeDate = computed(() => sevenDateArray.value[activeDateIndex.value]);

  const changeDate = (num) => {
    activeDateIndex.value += num;
  };

  return {
    isLoginOutShow,
    isLogin,
    isMsgShow,
    msgType,
    searchYearMonth,
    searchData,
    searchDataCount,
    isSearchLoading,
    isPieLoaded,
    pieObj,
    pieObjPriceArray,
    monthTotalPrice,
    sevenDateObj,
    activeDateIndex,

    sevenDateArray,
    sevenDateTotalPriceArray,
    activeDateDetailArray,
    activeDateTotalPrice,
    activeDate,
    sortedSearchData,

    changeDate
  };
});
