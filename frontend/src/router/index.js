import { createWebHistory, createRouter } from "vue-router";
import ConnectView from "@/views/ConnectView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PostView from "@/views/PostView.vue";

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
  },
  
  { 
    name: 'post',
    path: '/post', 
    component: PostView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
