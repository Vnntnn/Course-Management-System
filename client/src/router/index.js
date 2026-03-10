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
import Exampage from '@/pages/exampage.vue'
import Examresult from '@/pages/examresult.vue'

// Instructor Pages
import instructor_createchapter from '@/pages/instructor_createchapter.vue'
import instructor_createquestion from '@/pages/instructor_createquestion.vue'
import instructor_editchapter from '@/pages/instructor_editchapter.vue'
import instructor_editcourse from '@/pages/instructor_editcourse.vue'
import instructor_editexam from '@/pages/instructor_editexam.vue'
import instructor_editquestion from '@/pages/instructor_editquestion.vue'

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

  // Course
  {
    path: '/coursebrowser',
    component: coursebrowser
  },
  {
    path: '/course',
    component: coursepage
  },

  // Chapter
  {
    path: '/chapterlist',
    component: Chapterlist
  },
  {
    path: '/details',
    component: Chapterdetail
  },

  // Exam (Student)
  {
    path: '/examlist',
    component: Examlist
  },
  {
    path: '/examdesc',
    component: Examdescription
  },
  {
    path: '/exampage',
    component: Exampage
  },
  {
    path: '/examresult',
    component: Examresult
  },

  // Instructor
  {
    path: '/coursemanage',
    component: instructor_editcourse
  },
  {
    path: '/chaptercreate',
    component: instructor_createchapter
  },
  {
    path: '/chapteredit',
    component: instructor_editchapter
  },
  {
    path: '/exammanage',
    component: instructor_editexam
  },
  {
    path: '/questioncreate',
    component: instructor_createquestion
  },
  {
    path: '/questionedit',
    component: instructor_editquestion
  },
  {
    path: '/examquestion',
    component: instructor_createquestion
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router