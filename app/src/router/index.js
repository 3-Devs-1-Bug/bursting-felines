import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Game from "../views/Game.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/game/:id",
    name: "Game",
    component: Game
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
