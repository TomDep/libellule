import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'

const options : RouterOptions = {
  history: createWebHistory(),
  routes: []
};

export default createRouter(options);

