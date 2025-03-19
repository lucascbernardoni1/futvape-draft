<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <header class="bg-gray-800 py-4 px-6 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">Draft Picker</h1>
        <router-link 
          v-if="!isInDraft" 
          to="/" 
          class="text-gray-300 hover:text-white transition-colors"
        >
          Home
        </router-link>
      </div>
    </header>
    
    <main class="container mx-auto py-8 px-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDraftStore } from './stores/draft';

const route = useRoute();
const draftStore = useDraftStore();

const isInDraft = computed(() => {
  return route.path.includes('/draft') && draftStore.isDraftActive;
});
</script>