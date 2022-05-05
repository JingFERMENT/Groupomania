import { createWebHistory, createRouter } from "vue-router";
import ConnectView from "@/views/ConnectView.vue";
import ProfileView from "@/views/ProfileView.vue";
import MyPostView from "@/views/MyPostView.vue";
import ListOfPostsView from "@/views/ListOfPostsView.vue";
import ModifyPostView from "@/views/ModifyPostView.vue";
import AdminView from "@/views/AdminView.vue";


const routes = [
  //route pour inscription ou se connecter
  {
    name: "connect",
    path: "/",
    component: ConnectView,
  },

  //route pour inscription admin
    {
      name: "signup-admin",
      path: "/signup-admin",
      component: AdminView,
    },

  {
    name: "profile",
    path: "/profile",
    component: ProfileView,
  },

  {
    name: "post",
    path: "/post",
    component: MyPostView,
  },

  {
    name: "list",
    path: "/list",
    component: ListOfPostsView,
  },

  {
    name: "modifyPost",
    path: "/post/:id",
    component: ModifyPostView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
