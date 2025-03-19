<template>
    <div v-if="currentRoom" class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Draft Status -->
        <div class="lg:col-span-3 bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 class="text-2xl font-bold">Draft Room</h2>
              <p class="text-gray-400">Room Code: <span class="font-mono">{{ roomId }}</span></p>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="text-center">
                <p class="text-sm text-gray-400">Current Pick</p>
                <p class="text-xl font-bold">{{ currentPickIndex + 1 }}</p>
              </div>
              
              <div class="bg-blue-900 px-4 py-2 rounded-md text-center" v-if="isDraftActive">
                <p class="text-sm text-blue-300">
                  {{ isMyTurn ? "Your Turn" : "Opponent's Turn" }}
                </p>
                <p class="font-bold">
                  {{ isMyTurn ? "Select a Player" : "Waiting..." }}
                </p>
              </div>
              
              <div class="bg-green-900 px-4 py-2 rounded-md text-center" v-else>
                <p class="text-sm text-green-300">Draft Complete</p>
                <p class="font-bold">All players drafted</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Available Players -->
        <div class="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-4 bg-gray-700">
            <h3 class="text-lg font-semibold">Available Players ({{ availablePlayers.length }})</h3>
            <div class="flex gap-2 mt-2">
              <input
                v-model="searchQuery"
                type="text"
                class="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search players..."
              />
              <select
                v-model="positionFilter"
                class="px-4 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Positions</option>
                <option v-for="position in uniquePositions" :key="position" :value="position">
                  {{ position }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="overflow-auto max-h-[calc(100vh-400px)]">
            <table class="w-full text-left">
              <thead class="bg-gray-700 sticky top-0">
                <tr>
                  <th class="px-4 py-2">Name</th>
                  <th class="px-4 py-2">Position</th>
                  <th class="px-4 py-2">Team</th>
                  <th class="px-4 py-2 w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="player in filteredPlayers" 
                  :key="player.id" 
                  class="border-t border-gray-700 hover:bg-gray-700"
                >
                  <td class="px-4 py-2">{{ player.name }}</td>
                  <td class="px-4 py-2">{{ player.position }}</td>
                  <td class="px-4 py-2">{{ player.team }}</td>
                  <td class="px-4 py-2">
                    <button
                      @click="draftPlayer(player.id)"
                      class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
                      :disabled="!isMyTurn"
                    >
                      Draft
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPlayers.length === 0">
                  <td colspan="4" class="px-4 py-4 text-center text-gray-400">
                    No players available matching your filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Teams -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-4 bg-gray-700">
            <h3 class="text-lg font-semibold">Draft Results</h3>
          </div>
          
          <div class="p-4">
            <h4 class="font-medium mb-2">Your Team</h4>
            <div class="bg-gray-700 rounded-md overflow-hidden mb-6">
              <table class="w-full text-left">
                <thead class="bg-gray-600">
                  <tr>
                    <th class="px-3 py-2">Pick</th>
                    <th class="px-3 py-2">Name</th>
                    <th class="px-3 py-2">Position</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in myTeam" :key="player.id" class="border-t border-gray-600">
                    <td class="px-3 py-2">{{ player.pickNumber }}</td>
                    <td class="px-3 py-2">{{ player.name }}</td>
                    <td class="px-3 py-2">{{ player.position }}</td>
                  </tr>
                  <tr v-if="myTeam.length === 0">
                    <td colspan="3" class="px-3 py-3 text-center text-gray-400">
                      No players drafted yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h4 class="font-medium mb-2">Opponent's Team</h4>
            <div class="bg-gray-700 rounded-md overflow-hidden">
              <table class="w-full text-left">
                <thead class="bg-gray-600">
                  <tr>
                    <th class="px-3 py-2">Pick</th>
                    <th class="px-3 py-2">Name</th>
                    <th class="px-3 py-2">Position</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in opponentTeam" :key="player.id" class="border-t border-gray-600">
                    <td class="px-3 py-2">{{ player.pickNumber }}</td>
                    <td class="px-3 py-2">{{ player.name }}</td>
                    <td class="px-3 py-2">{{ player.position }}</td>
                  </tr>
                  <tr v-if="opponentTeam.length === 0">
                    <td colspan="3" class="px-3 py-3 text-center text-gray-400">
                      No players drafted yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Room Not Found</h2>
      <p class="text-gray-400">The draft room you're looking for doesn't exist.</p>
      <router-link to="/" class="text-blue-400 hover:text-blue-300 mt-4 inline-block">
        Return to Home
      </router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDraftStore } from '../stores/draft';
  
  const props = defineProps({
    roomId: {
      type: String,
      required: true
    }
  });
  
  const router = useRouter();
  const draftStore = useDraftStore();
  
  // Set current room
  onMounted(() => {
    draftStore.currentRoomId = props.roomId;
  });
  
  // Search and filter
  const searchQuery = ref('');
  const positionFilter = ref('');
  
  const currentRoom = computed(() => draftStore.currentRoom);
  const isDraftActive = computed(() => draftStore.isDraftActive);
  const currentPickIndex = computed(() => draftStore.currentPickIndex);
  const availablePlayers = computed(() => draftStore.availablePlayers);
  const myTeam = computed(() => draftStore.myTeam);
  const opponentTeam = computed(() => draftStore.opponentTeam);
  const isMyTurn = computed(() => draftStore.currentPicker === draftStore.userId);
  
  const uniquePositions = computed(() => {
    if (!currentRoom.value) return [];
    
    const positions = new Set();
    currentRoom.value.playerPool.forEach(player => {
      if (player.position) positions.add(player.position);
    });
    
    return Array.from(positions);
  });
  
  const filteredPlayers = computed(() => {
    if (!availablePlayers.value) return [];
    
    return availablePlayers.value.filter(player => {
      const matchesSearch = !searchQuery.value || 
        player.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        player.team.toLowerCase().includes(searchQuery.value.toLowerCase());
        
      const matchesPosition = !positionFilter.value || player.position === positionFilter.value;
      
      return matchesSearch && matchesPosition;
    });
  });
  
  function draftPlayer(playerId) {
    if (!isMyTurn.value) return;
    
    draftStore.draftPlayer(playerId);
  }
  </script>