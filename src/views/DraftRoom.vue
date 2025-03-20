<template>
  <div v-if="currentRoom" class="max-w-6xl mx-auto space-y-6">
    <Card>
      <template #header>
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
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Available Players -->
        <div class="lg:col-span-2">
          <Card>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">Available Players ({{ availablePlayers.length }})</h3>
                <div class="flex gap-2">
                  <Input
                    v-model="searchQuery"
                    placeholder="Search players..."
                    size="sm"
                    class="w-48"
                  />
                  <select
                    v-model="positionFilter"
                    class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Positions</option>
                    <option v-for="position in uniquePositions" :key="position" :value="position">
                      {{ position }}
                    </option>
                  </select>
                </div>
              </div>
            </template>

            <Table
              :headers="[
                { key: 'name', label: 'Name' },
                { key: 'position', label: 'Position' },
                { key: 'team', label: 'Team' },
                { key: 'actions', label: 'Action', class: 'w-24' }
              ]"
              :rows="filteredPlayers"
            >
              <template #actions="{ row }">
                <Button
                  @click="draftPlayer(row.id)"
                  :disabled="!isMyTurn"
                  size="sm"
                >
                  Draft
                </Button>
              </template>
            </Table>
          </Card>
        </div>
        
        <!-- Teams -->
        <div>
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold">Draft Results</h3>
            </template>

            <div class="space-y-6">
              <div>
                <h4 class="font-medium mb-2">Your Team</h4>
                <Table
                  :headers="[
                    { key: 'pickNumber', label: 'Pick', class: 'w-16' },
                    { key: 'name', label: 'Name' },
                    { key: 'position', label: 'Position' }
                  ]"
                  :rows="myTeam"
                />
              </div>
              
              <div>
                <h4 class="font-medium mb-2">Opponent's Team</h4>
                <Table
                  :headers="[
                    { key: 'pickNumber', label: 'Pick', class: 'w-16' },
                    { key: 'name', label: 'Name' },
                    { key: 'position', label: 'Position' }
                  ]"
                  :rows="opponentTeam"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  </div>
  <div v-else class="text-center py-12">
    <Card>
      <h2 class="text-2xl font-bold mb-4">Room Not Found</h2>
      <p class="text-gray-400">The draft room you're looking for doesn't exist.</p>
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