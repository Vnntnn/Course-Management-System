import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/home.vue'
import Login from '@/pages/login.vue'
import Signin from '@/pages/signin.vue'
import userdashboard from '@/pages/userdashboard.vue'
import coursebrowser from '@/pages/browsecourse.vue'
import coursepage from '@/pages/coursepage.vue'
import Chapterlist from '@/pages/chapterlist.vue'
import Chapterdetail from '@/pages/chapterdetail.vue'
import Examlist from '@/pages/examlist.vue'
import Examdescription from '@/pages/examdescription.vue'

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
  },
  {
    path: '/course',
    component: coursepage
  },
  {
    path: '/chapterlist',
    component: Chapterlist
  },
  {
    path: '/details',
    component: Chapterdetail
  },
  {
    path: '/examlist',
    component: Examlist
  },
  {
    path: '/examdesc',
    component: Examdescription
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router