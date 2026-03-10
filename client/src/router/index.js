import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/utils/auth'

// Public Pages
import Home from '@/pages/home.vue'
import Login from '@/pages/login.vue'
import Signin from '@/pages/signin.vue'

// User Pages
import UserDashboard from '@/pages/userdashboard.vue'
import CourseBrowser from '@/pages/browsecourse.vue'
import CoursePage from '@/pages/coursepage.vue'

// Chapter/Lesson Pages
import ChapterList from '@/pages/chapterlist.vue'
import ChapterDetail from '@/pages/chapterdetail.vue'

// Exam Pages
import ExamList from '@/pages/examlist.vue'
import ExamDescription from '@/pages/examdescription.vue'
import ExamPage from '@/pages/exampage.vue'
import ExamResult from '@/pages/examresult.vue'

// Instructor Pages
import InstructorCourseList from '@/pages/instructor_courselist.vue'
import InstructorCreateChapter from '@/pages/instructor_createchapter.vue'
import InstructorCreateQuestion from '@/pages/instructor_createquestion.vue'
import InstructorEditChapter from '@/pages/instructor_editchapter.vue'
import InstructorEditCourse from '@/pages/instructor_editcourse.vue'
import InstructorEditExam from '@/pages/instructor_editexam.vue'
import InstructorEditQuestion from '@/pages/instructor_editquestion.vue'
import InstructorQuestionList from '@/pages/instructor_questionlist.vue'

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true, public: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signin,
    meta: { guestOnly: true, public: true }
  },

  // User Routes (requires auth)
  {
    path: '/dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/browse',
    name: 'CourseBrowser',
    component: CourseBrowser,
    meta: { requiresAuth: true }
  },
  
  // Course Routes
  {
    path: '/course/:courseId',
    name: 'CoursePage',
    component: CoursePage,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/course/:courseId/chapters',
    name: 'ChapterList',
    component: ChapterList,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/course/:courseId/chapter/:lessonId',
    name: 'ChapterDetail',
    component: ChapterDetail,
    meta: { requiresAuth: true },
    props: true
  },

  // Exam Routes
  {
    path: '/course/:courseId/exams',
    name: 'ExamList',
    component: ExamList,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/exam/:examId',
    name: 'ExamDescription',
    component: ExamDescription,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/exam/:examId/take',
    name: 'ExamPage',
    component: ExamPage,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/exam/:examId/result',
    name: 'ExamResult',
    component: ExamResult,
    meta: { requiresAuth: true },
    props: true
  },

  // Instructor Routes
  {
    path: '/instructor/courses',
    name: 'InstructorCourseList',
    component: InstructorCourseList,
    meta: { requiresAuth: true, instructorOnly: true }
  },
  {
    path: '/instructor/course/create',
    name: 'InstructorCreateCourse',
    component: InstructorEditCourse,
    meta: { requiresAuth: true, instructorOnly: true }
  },
  {
    path: '/instructor/course/:courseId/edit',
    name: 'InstructorEditCourse',
    component: InstructorEditCourse,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },
  {
    path: '/instructor/course/:courseId/chapter/create',
    name: 'InstructorCreateChapter',
    component: InstructorCreateChapter,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },
  {
    path: '/instructor/course/:courseId/chapter/:lessonId/edit',
    name: 'InstructorEditChapter',
    component: InstructorEditChapter,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },
  {
    path: '/instructor/course/:courseId/exam/create',
    name: 'InstructorCreateExam',
    component: InstructorEditExam,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },
  {
    path: '/instructor/exam/:examId/edit',
    name: 'InstructorEditExam',
    component: InstructorEditExam,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },
  {
    path: '/instructor/exam/:examId/questions',
    name: 'InstructorQuestionList',
    component: InstructorQuestionList,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },
  {
    path: '/instructor/exam/:examId/question/create',
    name: 'InstructorCreateQuestion',
    component: InstructorCreateQuestion,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },
  {
    path: '/instructor/exam/:examId/question/:questionId/edit',
    name: 'InstructorEditQuestion',
    component: InstructorEditQuestion,
    meta: { requiresAuth: true, instructorOnly: true },
    props: true
  },

  // Redirect for exam management
  {
    path: '/instructor/exam/:examId',
    redirect: to => `/instructor/exam/${to.params.examId}/questions`
  },

  // Legacy redirects for backward compatibility
  { path: '/course', redirect: '/browse' },
  { path: '/chapterlist', redirect: '/browse' },
  { path: '/details', redirect: '/browse' },
  { path: '/examlist', redirect: '/browse' },
  { path: '/examdesc', redirect: '/browse' },
  { path: '/exampage', redirect: '/browse' },
  { path: '/examresult', redirect: '/dashboard' },
  { path: '/coursedashboard', redirect: '/instructor/courses' },
  { path: '/coursemanage', redirect: '/instructor/courses' },
  { path: '/user', redirect: '/dashboard' },
  { path: '/coursebrowser', redirect: '/browse' },
  
  // Catch-all 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, currentUser, getCurrentUser } = useAuth()

  // Try to get current user if not loaded
  if (!currentUser.value) {
    try {
      await getCurrentUser()
    } catch {
      // Not logged in - continue
    }
  }

  // Guest only pages (login, signup) - redirect to dashboard if logged in
  if (to.meta.guestOnly && isAuthenticated.value) {
    return next('/user')
  }

  // Protected routes - redirect to login if not authenticated
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next('/login')
  }

  // Instructor only routes
  if (to.meta.instructorOnly && currentUser.value?.role !== 'instructor') {
    return next('/user')
  }

  // Redirect home to dashboard if authenticated
  if (to.path === '/' && isAuthenticated.value) {
    return next('/user')
  }

  next()
})

export default router