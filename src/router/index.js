import { createWebHistory, createRouter } from "vue-router";
import Home from "../view/buyer/home/index.vue";
import Login from "../view/buyer/auth/login.vue";
import Register from "../view/buyer/auth/register.vue";
import Logout from "../view/buyer/auth/logout.vue";
import Profile from "../view/buyer/profile/index.vue";
import DetailOrder from "../view/buyer/order/detailOrder.vue";
import OrderHistory from "../view/buyer/order/index.vue";

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
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile
  },
  {
    path: "/order/:id",
    name: "order.detail",
    component: DetailOrder
  },
  {
    path: "/order",
    name: "order",
    component: OrderHistory
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;