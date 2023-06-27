import { createWebHistory, createRouter } from "vue-router";
import Home from "../view/buyer/home/index.vue";
import Login from "../view/buyer/auth/login.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;