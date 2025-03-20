<template>
  <div class="max-w-md mx-auto">
    <v-card>
      <template #header>
        <div class="flex items-center justify-center gap-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-2xl font-bold">J</span>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Joining Draft Room
          </h2>
        </div>
      </template>

      <div class="text-center mb-8">
        <div class="bg-gray-700 inline-block px-4 py-2 rounded-md">
          <span class="text-sm text-gray-400">Room Code:</span>
          <span class="ml-2 font-mono font-bold">{{ roomId }}</span>
        </div>
      </div>
      
      <div v-if="roomExists">
        <div v-if="isDraftActive" class="text-center">
          <p class="mb-4">The draft has already started!</p>
          <Button
            @click="goToDraft"
            size="lg"
          >
            Join Draft
          </Button>
        </div>
        
        <div v-else-if="roomStatus === 'setup'" class="text-center">
          <div class="flex items-center justify-center gap-4 mb-8">
            <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Waiting for host to set up the draft...</p>
          </div>
          
          <div class="text-gray-400 text-sm space-y-1">
            <p>The host is currently setting up the player pool.</p>
            <p>The draft will begin once they're ready.</p>
          </div>
        </div>
        
        <div v-else-if="roomStatus === 'completed'" class="text-center">
          <p class="mb-4">This draft has already been completed.</p>
          <Button
            to="/"
            variant="secondary"
            size="lg"
          >
            Return Home
          </Button>
        </div>
      </div>
      
      <div v-else class="text-center">
        <p class="text-red-400 mb-4">Room not found or invalid room code.</p>
        <Button
          to="/"
          variant="secondary"
          size="lg"
        >
          Return Home
        </Button>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDraftStore } from '../stores/draft';
import Card from '../components/ui/Card.vue';
import Button from '../components/ui/Button.vue';

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