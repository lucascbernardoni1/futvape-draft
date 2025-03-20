<template>
    <div v-if="isHost">
      <div class="max-w-4xl mx-auto space-y-6">
        <Card>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Room Setup</h2>
              <div class="flex items-center gap-4">
                <div class="bg-gray-700 px-4 py-2 rounded-md">
                  <span class="text-sm text-gray-400">Room Code:</span>
                  <span class="ml-2 font-mono font-bold">{{ roomId }}</span>
                </div>
                <Button
                  @click="copyRoomLink"
                  variant="ghost"
                  size="sm"
                  title="Copy invite link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </Button>
              </div>
            </div>
          </template>

          <div class="space-y-8">
            <div>
              <h3 class="text-lg font-semibold mb-4">Add Players to Draft Pool</h3>
              <div class="flex gap-2 mb-4">
                <Input
                  v-model="newPlayer.name"
                  placeholder="Player name"
                  class="flex-1"
                />
                <Input
                  v-model="newPlayer.position"
                  placeholder="Position"
                  class="w-24"
                />
                <Input
                  v-model="newPlayer.team"
                  placeholder="Team"
                  class="w-24"
                />
                <Button
                  @click="addPlayer"
                  :disabled="!newPlayer.name"
                  variant="success"
                >
                  Add
                </Button>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Or import players (CSV format)</label>
                <textarea
                  v-model="bulkImport"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name, Position, Team (one player per line)"
                  rows="3"
                ></textarea>
                <div class="mt-2 flex justify-end">
                  <Button
                    @click="importPlayers"
                    size="sm"
                  >
                    Import
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Player Pool ({{ playerPool.length }})</h3>
                <div class="flex gap-2">
                  <Button
                    @click="sortPlayersByName"
                    variant="ghost"
                    size="sm"
                  >
                    Sort by Name
                  </Button>
                  <Button
                    @click="sortPlayersByPosition"
                    variant="ghost"
                    size="sm"
                  >
                    Sort by Position
                  </Button>
                </div>
              </div>
              
              <Table
                :headers="[
                  { key: 'name', label: 'Name' },
                  { key: 'position', label: 'Position' },
                  { key: 'team', label: 'Team' },
                  { key: 'actions', label: 'Actions', class: 'w-16' }
                ]"
                :rows="playerPool"
              >
                <template #actions="{ row }">
                  <Button
                    @click="removePlayer(row.id)"
                    variant="danger"
                    size="sm"
                    title="Remove player"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </Button>
                </template>
              </Table>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="text-gray-400" v-if="!currentRoom.guestId">
                Waiting for opponent to join...
              </div>
              <div class="text-green-400" v-else>
                {{ guestName }} has joined the room!
              </div>
              
              <Button
                @click="startDraft"
                :disabled="playerPool.length === 0 || !currentRoom.guestId"
                size="lg"
              >
                Start Draft!
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <Card>
        <h2 class="text-2xl font-bold mb-4">Access Denied</h2>
        <p class="text-gray-400">You are not the host of this room.</p>
        <router-link to="/" class="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Return to Home
        </router-link>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDraftStore } from '../stores/draft';
  import Card from '../components/ui/Card.vue';
  import Button from '../components/ui/Button.vue';
  import Input from '../components/ui/Input.vue';
  import Table from '../components/ui/Table.vue';
  
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
    // You might want to add a toast notification here
  }
  
  function startDraft() {
    if (playerPool.value.length === 0 || !currentRoom.value.guestId) return;
    
    draftStore.startDraft();
  }
  </script>