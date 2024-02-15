<script setup>
import { ref } from 'vue';

// router
import { useRouter } from 'vue-router';

const router = useRouter();

// firestore
import { auth } from '@/firebase/init.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

const email = ref('');
const password = ref('');

const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;

      if (user.uid) {
        router.push('/');
      }
    })
    .catch((error) => {
      console.error(error.code);
      console.error(error.message);
    });
};
</script>

<template>
  <main class="container my-4">
    <div class="row">
      <div class="col-md-6 mx-auto">
        <section class="section p-4">
          <form class="form" @submit.prevent="login()">
            <!-- email -->
            <div class="mb-3">
              <label class="form-label fw-bold" for="email">電子郵件</label>
              <input class="form-control" id="email" type="text" v-model.trim="email" />
            </div>

            <!-- password -->
            <div class="mb-4">
              <label class="form-label fw-bold" for="password">密碼</label>
              <input
                class="form-control"
                id="password"
                type="password"
                autocomplete="on"
                v-model.trim="password"
              />
            </div>

            <button type="submit" class="btn btn-primary px-5">登入</button>
          </form>
        </section>
      </div>
    </div>
  </main>
</template>
