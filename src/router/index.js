import { createWebHistory, createRouter } from "vue-router";
import Home from "../view/Coba.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;