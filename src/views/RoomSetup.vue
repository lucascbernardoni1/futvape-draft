<template>
    <div v-if="isHost">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Room Setup</h2>
            <div class="flex items-center gap-4">
              <div class="bg-gray-700 px-4 py-2 rounded-md">
                <span class="text-sm text-gray-400">Room Code:</span>
                <span class="ml-2 font-mono font-bold">{{ roomId }}</span>
              </div>
              <button
                @click="copyRoomLink"
                class="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                title="Copy invite link"
              >
                <ClipboardIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Add Players to Draft Pool</h3>
            <div class="flex gap-2 mb-4">
              <input
                v-model="newPlayer.name"
                type="text"
                class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Player name"
              />
              <input
                v-model="newPlayer.position"
                type="text"
                class="w-24 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Position"
              />
              <input
                v-model="newPlayer.team"
                type="text"
                class="w-24 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Team"
              />
              <button
                @click="addPlayer"
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                :disabled="!newPlayer.name"
              >
                Add
              </button>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Or import players (CSV format)</label>
              <textarea
                v-model="bulkImport"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name, Position, Team (one player per line)"
                rows="3"
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button
                  @click="importPlayers"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
          
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Player Pool ({{ playerPool.length }})</h3>
              <div class="flex gap-2">
                <button
                  @click="sortPlayersByName"
                  class="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-md text-sm transition-colors"
                >
                  Sort by Name
                </button>
                <button
                  @click="sortPlayersByPosition"
                  class="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-md text-sm transition-colors"
                >
                  Sort by Position
                </button>
              </div>
            </div>
            
            <div class="bg-gray-700 rounded-md overflow-hidden">
              <table class="w-full text-left">
                <thead class="bg-gray-600">
                  <tr>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Position</th>
                    <th class="px-4 py-2">Team</th>
                    <th class="px-4 py-2 w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in playerPool" :key="player.id" class="border-t border-gray-600">
                    <td class="px-4 py-2">{{ player.name }}</td>
                    <td class="px-4 py-2">{{ player.position }}</td>
                    <td class="px-4 py-2">{{ player.team }}</td>
                    <td class="px-4 py-2">
                      <button
                        @click="removePlayer(player.id)"
                        class="text-red-400 hover:text-red-300 transition-colors"
                        title="Remove player"
                      >
                        <TrashIcon class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                  <tr v-if="playerPool.length === 0">
                    <td colspan="4" class="px-4 py-4 text-center text-gray-400">
                      No players added yet. Add players to start the draft.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-gray-400" v-if="!currentRoom.guestId">
              Waiting for opponent to join...
            </div>
            <div class="text-green-400" v-else>
              {{ guestName }} has joined the room!
            </div>
            
            <button
              @click="startDraft"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
              :disabled="playerPool.length === 0 || !currentRoom.guestId"
            >
              Start Draft!
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Access Denied</h2>
      <p class="text-gray-400">You are not the host of this room.</p>
      <router-link to="/" class="text-blue-400 hover:text-blue-300 mt-4 inline-block">
        Return to Home
      </router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDraftStore } from '../stores/draft';
  import { ClipboardIcon, TrashIcon } from 'lucide-vue-next';
  
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
  
  // Watch for draft start
  watch(() => draftStore.isDraftActive, (isActive) => {
    if (isActive) {
      router.push(`/draft/${props.roomId}`);
    }
  });
  
  const isHost = computed(() => draftStore.isHost);
  const currentRoom = computed(() => draftStore.currentRoom);
  const playerPool = computed(() => draftStore.currentRoom?.playerPool || []);
  const guestName = computed(() => {
    // In a real app, you'd store and retrieve the guest's name
    return "Guest Player";
  });
  
  const newPlayer = ref({
    name: '',
    position: '',
    team: ''
  });
  
  const bulkImport = ref('');
  
  function addPlayer() {
    if (!newPlayer.value.name) return;
    
    draftStore.addPlayerToPool({
      name: newPlayer.value.name,
      position: newPlayer.value.position || '',
      team: newPlayer.value.team || ''
    });
    
    // Reset form
    newPlayer.value = {
      name: '',
      position: '',
      team: ''
    };
  }
  
  function removePlayer(playerId) {
    draftStore.removePlayerFromPool(playerId);
  }
  
  function importPlayers() {
    if (!bulkImport.value) return;
    
    const lines = bulkImport.value.split('\n');
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const parts = line.split(',').map(part => part.trim());
      
      draftStore.addPlayerToPool({
        name: parts[0] || '',
        position: parts[1] || '',
        team: parts[2] || ''
      });
    });
    
    bulkImport.value = '';
  }
  
  function sortPlayersByName() {
    if (!currentRoom.value) return;
    
    currentRoom.value.playerPool.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  function sortPlayersByPosition() {
    if (!currentRoom.value) return;
    
    currentRoom.value.playerPool.sort((a, b) => a.position.localeCompare(b.position));
  }
  
  function copyRoomLink() {
    const link = `${window.location.origin}/join/${props.roomId}`;
    navigator.clipboard.writeText(link);
    // In a real app, you'd show a toast notification here
  }
  
  function startDraft() {
    if (playerPool.value.length === 0 || !currentRoom.value.guestId) return;
    
    draftStore.startDraft();
  }
  </script>