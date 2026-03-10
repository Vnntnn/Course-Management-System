<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HugeiconsIcon, UserIcon, Book02Icon } from '@/utils/icons'
const icons = { UserIcon, Book02Icon }
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import { courseAPI, enrollmentAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.courseId)

const { currentUser } = useAuth()
const isStudent = computed(() => currentUser.value?.role === 'student')

const course = ref(null)
const isEnrolled = ref(false)
const isLoading = ref(false)
const isEnrolling = ref(false)
const error = ref('')
const enrollSuccess = ref('')

const fetchCourse = async () => {
    if (!courseId.value) return
    isLoading.value = true
    error.value = ''
    try {
        const res = await courseAPI.getById(courseId.value)
        course.value = res.data
        
        // Check enrollment status for students
        if (isStudent.value) {
            const enrollRes = await enrollmentAPI.checkEnrollment(courseId.value)
            isEnrolled.value = enrollRes.data?.enrolled || false
        }
    } catch (err) {
        error.value = err.message || 'Failed to load course'
    } finally {
        isLoading.value = false
    }
}

const handleEnroll = async () => {
    if (!isStudent.value) {
        router.push(`/course/${courseId.value}/chapters`)
        return
    }
    
    isEnrolling.value = true
    error.value = ''
    try {
        await enrollmentAPI.enroll({ course_id: parseInt(courseId.value) })
        enrollSuccess.value = 'Enrolled successfully!'
        isEnrolled.value = true
        setTimeout(() => router.push(`/course/${courseId.value}/chapters`), 1000)
    } catch (err) {
        if (err.message?.includes('Already enrolled')) {
            isEnrolled.value = true
            router.push(`/course/${courseId.value}/chapters`)
        } else {
            error.value = err.message || 'Failed to enroll'
        }
    } finally {
        isEnrolling.value = false
    }
}

const goToCourse = () => router.push(`/course/${courseId.value}/chapters`)

const goBack = () => router.push('/browse')

onMounted(fetchCourse)
</script>

<template>
    <main class="mt-24 px-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">
            ← Back
        </Button>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading course...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <template v-if="course">
            <div class="flex gap-6 flex-col md:flex-row">
                <img
                    :src="course.thumbnail_url || 'https://i.pinimg.com/736x/a2/31/9c/a2319c01c458e70c57ddddbc4c2244b5.jpg'"
                    class="rounded-xl w-full md:w-80 h-52 object-cover"
                />
                <div class="flex-1 space-y-3">
                    <h1 class="text-4xl font-bold">{{ course.title }}</h1>
                    <p class="text-text-300 flex items-center gap-2">
                        <HugeiconsIcon :icon="icons.UserIcon" :size="18"/>
                        {{ course.instructor?.full_name || 'Instructor' }}
                    </p>
                    <p>{{ course.description }}</p>
                    <p class="text-text-400 text-sm">
                        {{ course._count?.lessons || course.lessons?.length || 0 }} lessons · {{ course._count?.exams || course.exams?.length || 0 }} exams
                    </p>

                    <div v-if="enrollSuccess" class="text-green-500">{{ enrollSuccess }}</div>

                    <div class="flex gap-3 flex-wrap">
                        <!-- Show different button based on enrollment status -->
                        <template v-if="isStudent">
                            <Button v-if="isEnrolled" @click="goToCourse" class="flex items-center gap-2">
                                <HugeiconsIcon :icon="icons.Book02Icon" :size="18"/>
                                Continue Learning
                            </Button>
                            <Button v-else @click="handleEnroll" :disabled="isEnrolling" class="flex items-center gap-2">
                                <HugeiconsIcon :icon="icons.Book02Icon" :size="18"/>
                                {{ isEnrolling ? 'Enrolling...' : 'Enroll & Start Learning' }}
                            </Button>
                        </template>
                        <Button v-else @click="goToCourse">
                            View Course
                        </Button>
                        <Button variant="primary_border" @click="router.push(`/course/${courseId}/exams`)">
                            View Exams
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Lesson preview -->
            <Contentcontainer v-if="course.lessons?.length > 0" class="space-y-3">
                <h2 class="text-2xl font-bold">Course Content</h2>
                <div v-for="(lesson, index) in course.lessons" :key="lesson.id"
                    class="p-3 rounded-lg bg-ci-secondary-1 flex justify-between items-center cursor-pointer hover:ring-2 ring-ci-secondary-3"
                    @click="router.push(`/course/${courseId}/chapter/${lesson.id}`)">
                    <span>{{ index + 1 }}. {{ lesson.title }}</span>
                    <span class="text-text-400 text-sm">{{ lesson.topics?.length || 0 }} topics</span>
                </div>
            </Contentcontainer>
        </template>
    </main>
</template>