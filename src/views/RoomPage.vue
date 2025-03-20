<template>
    <v-container fluid class="fill-height pa-0">
      <v-row v-if="room" class="fill-height ma-0">
        <!-- Host Side (Left) -->
        <v-col cols="12" md="3" class="host-side pa-4">
          <v-card class="fill-height">
            <v-card-title class="text-center">
              {{ room.host.name }}
              <v-chip
                v-if="draftStore.isHost"
                color="primary"
                size="small"
                class="ml-2"
              >
                You
              </v-chip>
            </v-card-title>
            <v-card-subtitle class="text-center">
              {{ room.host.players.length }} Players Picked
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text class="overflow-y-auto" style="max-height: calc(100vh - 200px)">
              <v-list>
                <v-list-item
                  v-for="(player, index) in room.host.players"
                  :key="index"
                  :title="player.name"
                  :subtitle="player.position"
                >
                  <template v-slot:prepend>
                    <v-avatar color="primary" class="text-white">
                      {{ index + 1 }}
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Available Players (Middle) -->
        <v-col cols="12" md="6" class="middle-section pa-4">
          <v-card class="fill-height">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Available Players</span>
              <div v-if="draftStore.isHost && !room.started">
                <v-file-input
                  label="Import Players (Excel/CSV)"
                  accept=".xlsx, .xls, .csv"
                  @change="handleFileUpload"
                  hide-details
                  class="d-inline-block mr-2"
                  style="max-width: 250px"
                ></v-file-input>
                <v-btn
                  color="success"
                  @click="startDraft"
                  :disabled="room.availablePlayers.length === 0"
                >
                  Começar Draft
                </v-btn>
              </div>
            </v-card-title>
            
            <v-card-subtitle v-if="room.started" class="text-center">
              Current Turn: 
              <v-chip
                :color="room.currentTurn === 'host' ? 'blue' : 'red'"
                class="ml-2"
              >
                {{ room.currentTurn === 'host' ? room.host.name : room.guest.name }}
              </v-chip>
              <span class="ml-2">Round: {{ room.round }}</span>
            </v-card-subtitle>
            
            <v-divider></v-divider>
            
            <v-card-text v-if="!room.started && draftStore.isHost" class="text-center">
              <v-btn
                color="primary"
                @click="showAddPlayerDialog = true"
                class="mb-4"
              >
                Add Player Manually
              </v-btn>
              
              <v-alert
                v-if="room.availablePlayers.length === 0"
                type="info"
                class="mb-4"
              >
                Please import players or add them manually before starting the draft.
              </v-alert>
            </v-card-text>
            
            <v-card-text v-if="!room.started && !draftStore.isHost" class="text-center">
              <v-alert type="info">
                Waiting for host to start the draft...
              </v-alert>
            </v-card-text>
            
            <v-card-text v-if="room.started" class="overflow-y-auto" style="max-height: calc(100vh - 200px)">
              <v-row>
                <v-col
                  v-for="(player, index) in room.availablePlayers"
                  :key="index"
                  cols="12" sm="6" md="4"
                >
                  <v-card
                    :disabled="!canPickPlayer"
                    @click="pickPlayer(index)"
                    :class="{ 'selectable': canPickPlayer }"
                    variant="outlined"
                  >
                    <v-card-title>{{ player.name }}</v-card-title>
                    <v-card-subtitle>{{ player.position }}</v-card-subtitle>
                    <v-card-text>
                      <div v-if="player.rating">Rating: {{ player.rating }}</div>
                      <div v-if="player.team">Team: {{ player.team }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              
              <v-alert
                v-if="room.completed"
                type="success"
                class="mt-4"
              >
                Draft completed! All players have been selected.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Guest Side (Right) -->
        <v-col cols="12" md="3" class="guest-side pa-4">
          <v-card class="fill-height">
            <v-card-title class="text-center">
              {{ room.guest.name }}
              <v-chip
                v-if="!draftStore.isHost"
                color="primary"
                size="small"
                class="ml-2"
              >
                You
              </v-chip>
            </v-card-title>
            <v-card-subtitle class="text-center">
              {{ room.guest.players.length }} Players Picked
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text class="overflow-y-auto" style="max-height: calc(100vh - 200px)">
              <v-list>
                <v-list-item
                  v-for="(player, index) in room.guest.players"
                  :key="index"
                  :title="player.name"
                  :subtitle="player.position"
                >
                  <template v-slot:prepend>
                    <v-avatar color="error" class="text-white">
                      {{ index + 1 }}
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Room ID Display -->
      <v-footer app class="d-flex justify-center pa-4">
        <v-card flat class="text-center">
          <v-card-text>
            Room ID: <strong>{{ id }}</strong>
            <v-btn
              icon="mdi-content-copy"
              size="small"
              class="ml-2"
              @click="copyRoomId"
            ></v-btn>
          </v-card-text>
        </v-card>
      </v-footer>
  
      <!-- Add Player Dialog -->
      <v-dialog v-model="showAddPlayerDialog" max-width="500px">
        <v-card>
          <v-card-title>Add Player</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addPlayer">
              <v-text-field
                v-model="newPlayer.name"
                label="Player Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="newPlayer.position"
                label="Position"
                required
              ></v-text-field>
              <v-text-field
                v-model="newPlayer.team"
                label="Team"
              ></v-text-field>
              <v-text-field
                v-model="newPlayer.rating"
                label="Rating"
                type="number"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="showAddPlayerDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="addPlayer">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useDraftStore, type Player, type Room } from '../store/draft';
  import * as XLSX from 'xlsx';
  
  const route = useRoute();
  const draftStore = useDraftStore();
  const id = route.params.id as string;
  
  const showAddPlayerDialog = ref(false);
  const newPlayer = ref<Player>({
    name: '',
    position: '',
    team: '',
    rating: null
  });
  
  const room = computed<Room | undefined>(() => {
    return draftStore.rooms[id];
  });
  
  const canPickPlayer = computed<boolean>(() => {
    if (!room.value || !room.value.started || room.value.completed) return false;
    
    const isMyTurn = (draftStore.isHost && room.value.currentTurn === 'host') || 
                    (!draftStore.isHost && room.value.currentTurn === 'guest');
    
    return isMyTurn;
  });
  
  onMounted(() => {
    if (!room.value) {
      // Create a temporary room if it doesn't exist (for demo purposes)
      draftStore.createRoom();
      draftStore.currentRoom = id;
    }
  });
  
  interface FileEvent {
    target: {
      files: File[];
    };
  }
  
  const handleFileUpload = (event: FileEvent): void => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target || !e.target.result) return;
      
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const players = XLSX.utils.sheet_to_json(firstSheet);
      
      // Map Excel columns to player properties
      const mappedPlayers: Player[] = players.map((p: any) => ({
        name: p.Name || p.name || '',
        position: p.Position || p.position || '',
        team: p.Team || p.team || '',
        rating: p.Rating || p.rating || null
      }));
      
      draftStore.importPlayers(id, mappedPlayers);
    };
    reader.readAsArrayBuffer(file);
  };
  
  const addPlayer = (): void => {
    if (newPlayer.value.name && newPlayer.value.position && room.value) {
      const playerToAdd: Player = { ...newPlayer.value };
      room.value.availablePlayers.push(playerToAdd);
      
      // Reset form
      newPlayer.value = {
        name: '',
        position: '',
        team: '',
        rating: null
      };
      
      showAddPlayerDialog.value = false;
    }
  };
  
  const startDraft = (): void => {
    draftStore.startDraft(id);
  };
  
  const pickPlayer = (index: number): void => {
    if (canPickPlayer.value) {
      draftStore.pickPlayer(id, index);
    }
  };
  
  const copyRoomId = (): void => {
    navigator.clipboard.writeText(id);
    // You could add a toast notification here
  };
  </script>
  
  <style scoped>
  .host-side {
    background-color: rgba(25, 118, 210, 0.05);
  }
  
  .guest-side {
    background-color: rgba(244, 67, 54, 0.05);
  }
  
  .selectable {
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .selectable:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  </style>