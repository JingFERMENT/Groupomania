import { createWebHistory, createRouter } from "vue-router";
import Connect from "@/views/Connect.vue";

const routes = [
  { 
    name: 'connect',
    path: '/', 
    component: Connect,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
