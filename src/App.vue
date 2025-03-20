<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { provide } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
provide('router', router);
</script>