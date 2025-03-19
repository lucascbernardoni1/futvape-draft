import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RoomSetup from '../views/RoomSetup.vue'
import DraftRoom from '../views/DraftRoom.vue'
import JoinRoom from '../views/JoinRoom.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/room/setup/:roomId',
      name: 'roomSetup',
      component: RoomSetup,
      props: true
    },
    {
      path: '/draft/:roomId',
      name: 'draftRoom',
      component: DraftRoom,
      props: true
    },
    {
      path: '/join/:roomId',
      name: 'joinRoom',
      component: JoinRoom,
      props: true
    }
  ]
})

export default router