<script setup>
import SearchForm from '@/components/SearchForm.vue';
import SearchList from '@/components/SearchList.vue';
import MsgComponent from '@/components/MsgComponent.vue';
</script>

<template>
  <main class="container my-4">
    <div class="row">
      <div class="col-md-6 mx-auto">
        <SearchForm />
        <SearchList />
      </div>
    </div>
  </main>

  <MsgComponent />
</template>
