<template>
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" class="text-center">
          <h1 class="text-h1 font-weight-bold">FUTVAPE</h1>
          
          <v-text-field
            v-model="userName"
            label="Your Name"
            variant="outlined"
            class="mt-10 mx-auto"
            style="max-width: 400px"
          ></v-text-field>
          
          <v-btn
            color="primary"
            size="x-large"
            class="mt-6"
            @click="createDraft"
          >
            Draft!
            <v-icon end icon="mdi-whistle"></v-icon>
          </v-btn>
          
          <v-divider class="my-10"></v-divider>
          
          <v-text-field
            v-model="roomIdToJoin"
            label="Room ID"
            variant="outlined"
            class="mx-auto"
            style="max-width: 400px"
            placeholder="Enter room ID to join"
          ></v-text-field>
          
          <v-btn
            color="secondary"
            class="mt-4"
            @click="joinDraft"
          >
            Join Draft
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDraftStore } from '../store/draft';
  
  const router = useRouter();
  const draftStore = useDraftStore();
  
  const userName = ref('');
  const roomIdToJoin = ref('');
  
  const createDraft = (): void => {
    draftStore.setUserName(userName.value);
    const roomId = draftStore.createRoom();
    router.push(`/room/${roomId}`);
  };
  
  const joinDraft = (): void => {
    if (roomIdToJoin.value) {
      draftStore.setUserName(userName.value);
      const success = draftStore.joinRoom(roomIdToJoin.value);
      if (success) {
        router.push(`/room/${roomIdToJoin.value}`);
      } else {
        alert('Room not found!');
      }
    }
  };
  </script>