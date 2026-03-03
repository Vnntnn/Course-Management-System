import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/home.vue'
import Login from '@/pages/login.vue'
import Signin from '@/pages/signin.vue'
import userdashboard from '@/pages/userdashboard.vue'
import coursebrowser from '@/pages/browsecourse.vue'

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
    path: '/signup',
    component: Signin
  },
  {
    path: '/user',
    component: userdashboard
  },
  {
    path: '/coursebrowser',
    component: coursebrowser
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router