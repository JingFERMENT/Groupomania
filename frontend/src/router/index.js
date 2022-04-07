import { createWebHistory, createRouter } from "vue-router";
import ConnectView from "@/views/ConnectView.vue";
import ProfileView from "@/views/ProfileView.vue";

const routes = [
  { 
    name: 'connect',
    path: '/', 
    component: ConnectView,
  },

  { 
    name: 'profile',
    path: '/profile', 
    component: ProfileView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
