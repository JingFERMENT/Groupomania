import { createWebHistory, createRouter } from "vue-router";
import ConnectView from "@/views/ConnectView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PostsView from "@/views/PostsView.vue";

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
    name: 'posts',
    path: '/posts', 
    component: PostsView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
