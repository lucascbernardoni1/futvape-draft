import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDraftStore = defineStore('draft', () => {
  // Room state
  const rooms = ref({})
  const currentRoomId = ref(null)
  
  // User state
  const userId = ref(crypto.randomUUID())
  const username = ref('')
  
  // Draft state
  const isDraftActive = ref(false)
  const currentPickIndex = ref(0)
  
  // Getters
  const currentRoom = computed(() => rooms.value[currentRoomId.value] || null)
  const isHost = computed(() => currentRoom.value?.hostId === userId.value)
  const currentPicker = computed(() => {
    if (!currentRoom.value || !isDraftActive.value) return null
    
    const pickOrder = generatePickOrder(
      currentRoom.value.hostId, 
      currentRoom.value.guestId
    )
    return pickOrder[currentPickIndex.value % pickOrder.length]
  })
  
  const availablePlayers = computed(() => {
    if (!currentRoom.value) return []
    return currentRoom.value.playerPool.filter(
      player => !currentRoom.value.draftedPlayers.some(dp => dp.id === player.id)
    )
  })
  
  const myTeam = computed(() => {
    if (!currentRoom.value) return []
    return currentRoom.value.draftedPlayers.filter(
      player => player.draftedBy === userId.value
    )
  })
  
  const opponentTeam = computed(() => {
    if (!currentRoom.value) return []
    const opponentId = userId.value === currentRoom.value.hostId 
      ? currentRoom.value.guestId 
      : currentRoom.value.hostId
    
    return currentRoom.value.draftedPlayers.filter(
      player => player.draftedBy === opponentId
    )
  })
  
  // Actions
  function createRoom() {
    const roomId = generateRoomId()
    rooms.value[roomId] = {
      id: roomId,
      hostId: userId.value,
      guestId: null,
      playerPool: [],
      draftedPlayers: [],
      status: 'setup' // setup, waiting, active, completed
    }
    currentRoomId.value = roomId
    return roomId
  }
  
  function joinRoom(roomId) {
    if (!rooms.value[roomId]) {
      rooms.value[roomId] = {
        id: roomId,
        hostId: null,
        guestId: userId.value,
        playerPool: [],
        draftedPlayers: [],
        status: 'waiting'
      }
    } else if (rooms.value[roomId].status === 'setup' || rooms.value[roomId].status === 'waiting') {
      rooms.value[roomId].guestId = userId.value
      rooms.value[roomId].status = 'waiting'
    }
    currentRoomId.value = roomId
  }
  
  function addPlayerToPool(player) {
    if (!currentRoom.value || !isHost.value) return
    
    // Add ID if not present
    if (!player.id) {
      player.id = crypto.randomUUID()
    }
    
    rooms.value[currentRoomId.value].playerPool.push(player)
  }
  
  function removePlayerFromPool(playerId) {
    if (!currentRoom.value || !isHost.value) return
    
    const index = rooms.value[currentRoomId.value].playerPool.findIndex(p => p.id === playerId)
    if (index !== -1) {
      rooms.value[currentRoomId.value].playerPool.splice(index, 1)
    }
  }
  
  function startDraft() {
    if (!currentRoom.value || !isHost.value || currentRoom.value.guestId === null) return
    
    rooms.value[currentRoomId.value].status = 'active'
    isDraftActive.value = true
    currentPickIndex.value = 0
  }
  
  function draftPlayer(playerId) {
    if (!isDraftActive.value || !currentRoom.value) return
    
    // Check if it's the user's turn
    if (currentPicker.value !== userId.value) return
    
    const player = currentRoom.value.playerPool.find(p => p.id === playerId)
    if (!player) return
    
    // Add player to drafted list
    rooms.value[currentRoomId.value].draftedPlayers.push({
      ...player,
      draftedBy: userId.value,
      pickNumber: currentPickIndex.value + 1
    })
    
    // Move to next pick
    currentPickIndex.value++
    
    // Check if draft is complete
    if (currentRoom.value.draftedPlayers.length === currentRoom.value.playerPool.length) {
      rooms.value[currentRoomId.value].status = 'completed'
      isDraftActive.value = false
    }
  }
  
  function setUsername(name) {
    username.value = name
  }
  
  // Helper functions
  function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }
  
  function generatePickOrder(hostId, guestId) {
    // First round: guest picks 1, host picks 2
    // After that, alternating picks
    return [guestId, hostId, hostId, ...generateAlternatingArray(guestId, hostId, 100)]
  }
  
  function generateAlternatingArray(a, b, length) {
    const result = []
    for (let i = 0; i < length; i++) {
      result.push(i % 2 === 0 ? a : b)
    }
    return result
  }
  
  return {
    rooms,
    currentRoomId,
    userId,
    username,
    isDraftActive,
    currentPickIndex,
    currentRoom,
    isHost,
    currentPicker,
    availablePlayers,
    myTeam,
    opponentTeam,
    createRoom,
    joinRoom,
    addPlayerToPool,
    removePlayerFromPool,
    startDraft,
    draftPlayer,
    setUsername
  }
})