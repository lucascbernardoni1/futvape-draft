<template>
  <div class="max-w-md mx-auto">
    <Card>
      <template #header>
        <div class="flex items-center justify-center gap-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-2xl font-bold">D</span>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Welcome to Draft Picker
          </h2>
        </div>
      </template>

      <div class="space-y-6">
        <Input
          v-model="username"
          label="Your Name"
          placeholder="Enter your name"
          size="lg"
        />
        
        <div class="flex flex-col gap-4">
          <Button
            @click="createNewRoom"
            :disabled="!username"
            size="lg"
            class="w-full"
            color="primary"
          >
            Create New Draft Room
          </Button>
          
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <Input
              v-model="roomCode"
              placeholder="Enter room code"
              size="lg"
              class="flex-1 uppercase"
            />
            <Button
              @click="joinExistingRoom"
              :disabled="!username || !roomCode"
              variant="secondary"
              size="lg"
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </Card>
    
    <div class="text-center text-gray-400 text-sm mt-6 space-y-1">
      <p>Create a room to start a draft with friends</p>
      <p>or join an existing room with a code</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDraftStore } from '../stores/draft';
import Card from '../components/ui/Card.vue';
import Button from '../components/ui/Button.vue';
import Input from '../components/ui/Input.vue';

const router = useRouter();
const draftStore = useDraftStore();

const username = ref('');
const roomCode = ref('');

function createNewRoom() {
  if (!username.value) return;
  
  draftStore.setUsername(username.value);
  const roomId = draftStore.createRoom();
  router.push(`/room/setup/${roomId}`);
}

function joinExistingRoom() {
  if (!username.value || !roomCode.value) return;
  
  draftStore.setUsername(username.value);
  const roomId = roomCode.value.toUpperCase();
  draftStore.joinRoom(roomId);
  router.push(`/join/${roomId}`);
}
</script>