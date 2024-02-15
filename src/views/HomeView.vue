<script setup>
import HomeForm from '@/components/HomeForm.vue';
import HomeList from '@/components/HomeList.vue';
import MsgComponent from '@/components/MsgComponent.vue';
</script>

<template>
  <main class="container my-4">
    <div class="row">
      <div class="col-md-6 mx-auto">
        <HomeForm />
        <HomeList />
      </div>
    </div>
  </main>

  <MsgComponent />
</template>
