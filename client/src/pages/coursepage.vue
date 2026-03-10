<script setup>
import { ref, onMounted } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons/index'
import Button from '@/assets/button.vue';
import Contentcontainer from '@/assets/contentcontainer.vue';
import { go, goBack } from '@/utils/navigation';
import { courseAPI, enrollmentAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')

const { currentUser } = useAuth()
const course = ref(null)
const isLoading = ref(false)
const isEnrolling = ref(false)
const error = ref('')
const enrollSuccess = ref('')

const fetchCourse = async () => {
    if (!courseId) return
    isLoading.value = true
    try {
        const res = await courseAPI.getById(courseId)
        course.value = res.data
    } catch (err) {
        error.value = err.message || 'Failed to load course'
    } finally {
        isLoading.value = false
    }
}

const handleEnroll = async () => {
    isEnrolling.value = true
    error.value = ''
    try {
        await enrollmentAPI.enroll({ course_id: parseInt(courseId) })
        enrollSuccess.value = 'Enrolled successfully!'
        // Navigate to the chapter list
        setTimeout(() => go(`/chapterlist?courseId=${courseId}`), 1000)
    } catch (err) {
        if (err.message?.includes('Already enrolled')) {
            go(`/chapterlist?courseId=${courseId}`)
        } else {
            error.value = err.message || 'Failed to enroll'
        }
    } finally {
        isEnrolling.value = false
    }
}

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
                        {{ course.lessons?.length || 0 }} lessons · {{ course.exams?.length || 0 }} exams
                    </p>

                    <div v-if="enrollSuccess" class="text-green-500">{{ enrollSuccess }}</div>

                    <div class="flex gap-3">
                        <Button @click="handleEnroll" :disabled="isEnrolling">
                            <HugeiconsIcon :icon="icons.Book02Icon" :size="18"/>
                            {{ isEnrolling ? 'Enrolling...' : 'Enroll' }}
                        </Button>
                        <Button variant="primary_border" @click="go(`/chapterlist?courseId=${courseId}`)">
                            View Lessons
                        </Button>
                        <Button variant="primary_border" @click="go(`/examlist?courseId=${courseId}`)">
                            View Exams
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Lesson preview -->
            <Contentcontainer v-if="course.lessons?.length > 0" class="space-y-3">
                <h2 class="text-2xl font-bold">Course Content</h2>
                <div v-for="(lesson, index) in course.lessons" :key="lesson.id"
                    class="p-3 rounded-lg bg-ci-secondary-1 flex justify-between items-center">
                    <span>{{ index + 1 }}. {{ lesson.title }}</span>
                    <span class="text-text-400 text-sm">{{ lesson.topics?.length || 0 }} topics</span>
                </div>
            </Contentcontainer>
        </template>
    </main>
</template>