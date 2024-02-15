<script setup>
import { RouterLink, RouterView } from 'vue-router';

// store
import { useMoneyStore } from '@/stores/money.js';

const moneyStore = useMoneyStore();

// firestore
import { auth } from '@/firebase/init.js';
import { signOut } from 'firebase/auth';

const logout = () => {
  signOut(auth)
    .then(() => {})
    .catch((err) => console.error(err));
};
</script>

<template>
  <div class="nav-shadow pt-1">
    <div class="container-xxl">
      <nav class="nav align-items-center mx-auto">
        <RouterLink class="nav-link" to="/"><i class="fa-solid fa-house me-2"></i>Home</RouterLink>
        <RouterLink class="nav-link" to="/search"
          ><i class="fa-solid fa-magnifying-glass me-2"></i>Search</RouterLink
        >
        <template v-if="moneyStore.isLoginOutShow">
          <RouterLink class="nav-link ms-auto" to="/login" v-if="!moneyStore.isLogin"
            ><i class="fa-solid fa-user me-2"></i>Login</RouterLink
          >
          <button type="button" class="btn btn-warning ms-auto me-3" @click="logout" v-else>
            <i class="fa-solid fa-person-running me-2"></i> Logout
          </button>
        </template>
      </nav>
    </div>
  </div>

  <RouterView />
</template>

<style scoped>
.nav-shadow {
  height: 48px;
  background-color: #fff;
  box-shadow: rgba(65, 69, 73, 0.15) 0px 0px 5px 1px;
}
</style>
