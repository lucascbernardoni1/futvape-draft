import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import RoomPage from '../views/RoomPage.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: RoomPage,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;