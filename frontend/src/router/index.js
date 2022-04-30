import { createWebHistory, createRouter } from "vue-router";
import ConnectView from "@/views/ConnectView.vue";
import ProfileView from "@/views/ProfileView.vue";
import MyPostView from "@/views/MyPostView.vue";
import ListOfPostsView from "@/views/ListOfPostsView.vue";
import ModifyPostView from "@/views/ModifyPostView.vue";
import TransformAdminView from "@/views/TransformAdminView.vue";

const routes = [
  {
    name: "connect",
    path: "/",
    component: ConnectView,
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

  {
    name: "transformAdmin",
    path: "/admin",
    component: TransformAdminView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
