<template>
    <div class="max-w-md mx-auto">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-6 text-center">Joining Draft Room</h2>
        
        <div class="text-center mb-8">
          <div class="bg-gray-700 inline-block px-4 py-2 rounded-md">
            <span class="text-sm text-gray-400">Room Code:</span>
            <span class="ml-2 font-mono font-bold">{{ roomId }}</span>
          </div>
        </div>
        
        <div v-if="roomExists">
          <div v-if="isDraftActive">
            <p class="text-center mb-4">The draft has already started!</p>
            <div class="flex justify-center">
              <button
                @click="goToDraft"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
              >
                Join Draft
              </button>
            </div>
          </div>
          <div v-else-if="roomStatus === 'setup'">
            <div class="flex items-center justify-center gap-4 mb-8">
              <LoaderIcon class="w-6 h-6 animate-spin text-blue-500" />
              <p>Waiting for host to set up the draft...</p>
            </div>
            
            <div class="text-center text-gray-400 text-sm">
              <p>The host is currently setting up the player pool.</p>
              <p>The draft will begin once they're ready.</p>
            </div>
          </div>
          <div v-else-if="roomStatus === 'completed'">
            <p class="text-center mb-4">This draft has already been completed.</p>
            <div class="flex justify-center">
              <router-link
                to="/"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
              >
                Return Home
              </router-link>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-center text-red-400 mb-4">Room not found or invalid room code.</p>
          <div class="flex justify-center">
            <router-link
              to="/"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Return Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDraftStore } from '../stores/draft';
  import { LoaderIcon } from 'lucide-vue-next';
  
  const props = defineProps({
    roomId: {
      type: String,
      required: true
    }
  });
  
  const router = useRouter();
  const draftStore = useDraftStore();
  
  // Join the room
  onMounted(() => {
    draftStore.joinRoom(props.roomId);
  });
  
  // Watch for draft start
  watch(() => draftStore.isDraftActive, (isActive) => {
    if (isActive) {
      router.push(`/draft/${props.roomId}`);
    }
  });
  
  const roomExists = computed(() => !!draftStore.currentRoom);
  const isDraftActive = computed(() => draftStore.isDraftActive);
  const roomStatus = computed(() => draftStore.currentRoom?.status || '');
  
  function goToDraft() {
    router.push(`/draft/${props.roomId}`);
  }
  </script>