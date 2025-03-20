<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <header class="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-lg font-bold">D</span>
            </div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Draft Picker
            </h1>
          </div>
          
          <!-- <nav class="flex items-center gap-4">
            <router-link 
              v-if="!isInDraft" 
              to="/" 
              class="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </router-link>
          </nav> -->
        </div>
      </div>
    </header>
    
    <main class="container mx-auto py-8 px-4">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>