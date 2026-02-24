import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/home.vue'
import Login from '@/pages/login.vue'
import Signin from '@/pages/signin.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signin',
    component: Signin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router