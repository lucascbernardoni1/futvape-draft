<template>
    <div class="max-w-md mx-auto">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-6 text-center">Welcome to Draft Picker</h2>
        
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium mb-2">Your Name</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        
        <div class="flex flex-col gap-4">
          <button
            @click="createNewRoom"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
            :disabled="!username"
          >
            Create New Draft Room
          </button>
          
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <input
              v-model="roomCode"
              type="text"
              class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="Enter room code"
            />
            <button
              @click="joinExistingRoom"
              class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
              :disabled="!username || !roomCode"
            >
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div class="text-center text-gray-400 text-sm">
        <p>Create a room to start a draft with friends</p>
        <p>or join an existing room with a code</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDraftStore } from '../stores/draft';
  
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