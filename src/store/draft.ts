import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export interface Player {
  name: string;
  position: string;
  team?: string;
  rating?: number | null;
}

export interface TeamData {
  name: string;
  players: Player[];
}

export interface Room {
  id: string;
  host: TeamData;
  guest: TeamData;
  availablePlayers: Player[];
  currentTurn: 'host' | 'guest';
  round: number;
  started: boolean;
  completed: boolean;
}

interface DraftState {
  rooms: Record<string, Room>;
  currentRoom: string | null;
  userName: string;
  isHost: boolean;
}

export const useDraftStore = defineStore('draft', {
  state: (): DraftState => ({
    rooms: {},
    currentRoom: null,
    userName: '',
    isHost: false
  }),
  
  actions: {
    createRoom(): string {
      const roomId = uuidv4();
      this.rooms[roomId] = {
        id: roomId,
        host: {
          name: this.userName || 'Host',
          players: []
        },
        guest: {
          name: 'Guest',
          players: []
        },
        availablePlayers: [],
        currentTurn: 'guest', // guest starts
        round: 1,
        started: false,
        completed: false
      };
      this.currentRoom = roomId;
      this.isHost = true;
      return roomId;
    },
    
    joinRoom(roomId: string): boolean {
      if (this.rooms[roomId]) {
        this.currentRoom = roomId;
        this.isHost = false;
        this.rooms[roomId].guest.name = this.userName || 'Guest';
        return true;
      }
      return false;
    },
    
    setUserName(name: string): void {
      this.userName = name;
      if (this.currentRoom && this.isHost) {
        this.rooms[this.currentRoom].host.name = name;
      } else if (this.currentRoom) {
        this.rooms[this.currentRoom].guest.name = name;
      }
    },
    
    importPlayers(roomId: string, players: Player[]): void {
      if (this.rooms[roomId]) {
        this.rooms[roomId].availablePlayers = players;
      }
    },
    
    startDraft(roomId: string): void {
      if (this.rooms[roomId]) {
        this.rooms[roomId].started = true;
      }
    },
    
    pickPlayer(roomId: string, playerIndex: number): void {
      const room = this.rooms[roomId];
      if (!room || !room.started || room.completed) return;
      
      const player = room.availablePlayers.splice(playerIndex, 1)[0];
      
      if (room.currentTurn === 'host') {
        room.host.players.push(player);
        
        // First round special rule: host picks 2 players
        if (room.round === 1 && room.host.players.length === 1) {
          // Host still has one more pick in the first round
          return;
        }
        
        room.currentTurn = 'guest';
        if (room.round === 1) {
          room.round = 2; // Move to second round after host's second pick
        }
      } else {
        room.guest.players.push(player);
        room.currentTurn = 'host';
        if (room.guest.players.length === 1) {
          // After guest's first pick, it's host's turn in the first round
        }
      }
      
      // Check if draft is complete
      if (room.availablePlayers.length === 0) {
        room.completed = true;
      }
    }
  }
});