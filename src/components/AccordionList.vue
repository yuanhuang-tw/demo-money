<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  data: Array,
  modalId: {
    type: Number,
    default: 0
  }
});

const listData = computed(() => props.data);

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

// firestore
import db from '@/firebase/init.js';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

// sweetalert
import swal from 'sweetalert';

// delete doc
const deleteDocFn = (id, date) => {
  swal({
    title: 'Delete',
    text: '確定要刪除此紀錄？',
    icon: 'warning',
    buttons: [true, 'Delete']
  })
    .then(async (willDelete) => {
      if (willDelete) {
        const docRef = doc(db, date.slice(0, 7), id);
        await deleteDoc(docRef);

        moneyStore.isMsgShow = true;
        moneyStore.msgType = 'delete';

        setTimeout(() => {
          moneyStore.isMsgShow = false;
          moneyStore.msgType = '';
        }, 5000);
      }
    })
    .catch((err) => console.error(err));
};

// show doc
const updateDate = ref('');
const updateType = ref('');
const updateItem = ref('');
const updatePrice = ref('');
const updateNote = ref('');
const updateId = ref('');

const showDocFn = (id) => {
  listData.value.forEach((ele) => {
    if (ele.id === id) {
      updateDate.value = ele.date;
      updateType.value = ele.type;
      updateItem.value = ele.item;
      updatePrice.value = ele.price;
      updateNote.value = ele.note;
      updateId.value = ele.id;
    }
  });
};

// update doc
const updateDocFn = () => {
  if (!validateForm(updateItem.value, updatePrice.value)) {
    return;
  }

  const myModalEl = document.getElementById(`modal-${props.modalId}`);
  const myModal = bootstrap.Modal.getInstance(myModalEl);
  myModal.hide();

  const docRef = doc(db, updateDate.value.slice(0, 7), updateId.value);

  updateDoc(docRef, {
    type: updateType.value,
    item: updateItem.value,
    price: updatePrice.value,
    note: updateNote.value
  })
    .then(() => {
      moneyStore.isMsgShow = true;
      moneyStore.msgType = 'update';

      setTimeout(() => {
        moneyStore.isMsgShow = false;
        moneyStore.msgType = '';
      }, 5000);
    })
    .catch((err) => console.error(err));
};

onMounted(() => {
  const list = document.querySelector(`.accordion-list-${props.modalId}`);

  list.addEventListener('click', (e) => {
    const ele = e.target;

    if (
      ele.tagName === 'SPAN' ||
      ele.classList.contains('accordion-btn') ||
      ele.classList.contains('fa-circle-plus') ||
      ele.classList.contains('fa-circle-minus')
    ) {
      const btn = ele.closest('.accordion-btn');
      const icon = btn.querySelector('.fa-icon > i');

      btn.classList.toggle('active');

      if (icon.classList.contains('fa-circle-plus')) {
        icon.classList.remove('fa-circle-plus');
        icon.classList.add('fa-circle-minus');
      } else {
        icon.classList.remove('fa-circle-minus');
        icon.classList.add('fa-circle-plus');
      }
    }
  });
});

function validateForm(item, price) {
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
  <ul class="accordion-list mb-0 ps-3 list-unstyled" :class="`accordion-list-${props.modalId}`">
    <li
      class="position-relative"
      :class="{ 'mb-3': i !== listData.length - 1 }"
      v-for="(ele, i) in listData"
      :key="ele.id"
    >
      <div class="accordion-container">
        <button class="accordion-btn text-start py-2 px-3 position-relative" type="button">
          <span class="badge rounded-pill text-bg-info me-2 position-relative">
            {{ ele.type }}
          </span>
          <span class="fs-4">{{ ele.item }}</span>
          <span class="d-block fs-5 ps-1">
            <span class="twd text-secondary">
              <i class="fa-regular fa-calendar"></i> {{ ele.date }}
            </span>
            <span class="twd text-secondary ms-4">TWD</span>
            {{ ele.price.toLocaleString() }}
          </span>
          <span class="fa-icon fs-5 position-absolute">
            <i class="fa-solid fa-circle-plus"></i>
          </span>
        </button>
        <div class="accordion-content">
          <div class="px-3 pb-3">
            <div class="note pt-2" style="white-space: pre-line">{{ ele.note }}</div>
            <template v-if="moneyStore.isLogin">
              <div class="mt-3">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="deleteDocFn(ele.id, ele.date)"
                >
                  <i class="fa-regular fa-trash-can"></i> 刪除
                </button>
                <button
                  class="btn btn-outline-secondary ms-2"
                  type="button"
                  data-bs-toggle="modal"
                  :data-bs-target="`#modal-${props.modalId}`"
                  @click="showDocFn(ele.id)"
                >
                  <i class="fa-solid fa-pen"></i> 修改
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </li>
  </ul>

  <teleport to="body">
    <!-- Modal -->
    <div
      class="modal fade"
      :id="`modal-${props.modalId}`"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="form">
              <!-- 類別 -->
              <div class="mb-3">
                <label class="form-label fw-bold" :for="`type-${props.modalId}`">類別</label>
                <select class="form-select" :id="`type-${props.modalId}`" v-model="updateType">
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
                <label class="form-label fw-bold" :for="`item-${props.modalId}`">項目</label>
                <input
                  class="form-control"
                  :id="`item-${props.modalId}`"
                  type="text"
                  v-model.trim="updateItem"
                />
              </div>

              <!-- 價格 -->
              <div class="mb-3">
                <label class="form-label fw-bold" :for="`price-${props.modalId}`">價格</label>
                <input
                  class="form-control"
                  :id="`price-${props.modalId}`"
                  type="number"
                  min="0"
                  v-model.number.trim="updatePrice"
                />
              </div>

              <!-- 備註 -->
              <div class="mb-4">
                <label class="form-label fw-bold" :for="`note-${props.modalId}`">備註</label>
                <textarea
                  class="form-control"
                  :id="`note-${props.modalId}`"
                  style="height: 80px"
                  v-model.trim="updateNote"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="updateDocFn()">Update</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style>
.accordion-list li::before {
  display: inline-block;
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #000;
  position: absolute;
  top: 24px;
  left: -16px;
}

.accordion-container {
  border-radius: 16px;

  transition: background-color 0.3s ease-in;
}

.accordion-container:hover {
  background-color: rgb(248, 249, 250);
}

.accordion-btn {
  width: 100%;
  border: none;
  background-color: transparent;
  color: #212529;
}

.accordion-btn .badge {
  top: -3px;
}

.accordion-btn .fa-icon {
  top: 50%;
  transform: translateY(-50%);
  right: 17px;
  opacity: 0.6;
  transition: opacity 0.3s ease-in;
}

.accordion-container:hover .fa-icon {
  opacity: 0.9;
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: 0.6s ease-in-out;
}

.accordion-content .note {
  border-top: 1px dashed #ebe6e6;
}

.accordion-btn.active + .accordion-content {
  max-height: 500px;
}

.twd {
  font-size: 0.875rem;
}
</style>
