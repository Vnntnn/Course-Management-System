<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HugeiconsIcon, Add01Icon } from '@/utils/icons'
const icons = { Add01Icon }
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import { courseAPI, enrollmentAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.courseId)

const { currentUser } = useAuth()
const role = computed(() => currentUser.value?.role || 'student')
const isInstructor = computed(() => role.value === 'instructor')

const course = ref(null)
const lessons = ref([])
const isLoading = ref(false)
const error = ref('')
const isEnrolled = ref(false)
const enrollChecked = ref(false)

const checkAccess = async () => {
    // Instructors always have access
    if (role.value === 'instructor') {
        isEnrolled.value = true
        enrollChecked.value = true
        return
    }
    if (!courseId.value) return
    try {
        const res = await enrollmentAPI.checkEnrollment(courseId.value)
        isEnrolled.value = res.data?.enrolled === true
    } catch {
        isEnrolled.value = false
    }
    enrollChecked.value = true
}

const fetchCourse = async () => {
    if (!courseId.value) return
    isLoading.value = true
    error.value = ''
    try {
        const res = await courseAPI.getById(courseId.value, true)
        course.value = res.data
        lessons.value = res.data?.lessons || []
    } catch (err) {
        error.value = err.message || 'Failed to load lessons'
    } finally {
        isLoading.value = false
    }
}

const goBack = () => router.push(`/course/${courseId.value}`)

onMounted(fetchCourse)
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">
            ← Back to Course
        </Button>

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-4xl font-bold">{{ course?.title || 'Lessons' }}</h1>
                <p class="text-text-400">{{ lessons.length }} lesson(s)</p>
            </div>

            <Button
                v-if="isInstructor"
                class="flex gap-2"
                @click="router.push(`/instructor/course/${courseId}/chapter/create`)"
            >
                <HugeiconsIcon :icon="icons.Add01Icon"/>
                Create Lesson
            </Button>
        </div>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading lessons...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <Contentcontainer v-if="lessons.length === 0 && !isLoading" class="text-center py-8 text-text-400">
            No lessons in this course yet.
        </Contentcontainer>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
                v-for="(lesson, index) in lessons"
                :key="lesson.id"
                class="rounded-xl p-4 hover:ring-2 bg-ci-secondary-1 ring-ci-secondary-3 transition cursor-pointer"
                @click="router.push(`/course/${courseId}/chapter/${lesson.id}`)"
            >
                <h2 class="text-2xl font-semibold mt-2">
                    Chapter {{ index + 1 }} - {{ lesson.title }}
                </h2>
                <p class="p-3 text-text-400">
                    {{ lesson.topics?.length || 0 }} topics
                </p>

                <div class="flex gap-2">
                    <Button @click.stop="router.push(`/course/${courseId}/chapter/${lesson.id}`)">
                        {{ isInstructor ? 'View' : 'Read' }}
                    </Button>
                    <Button
                        v-if="isInstructor"
                        variant="primary_border"
                        @click.stop="router.push(`/instructor/course/${courseId}/chapter/${lesson.id}/edit`)"
                    >
                        Edit
                    </Button>
                </div>
            </div>
        </div>

        <!-- Navigation buttons -->
        <div class="flex gap-3 pt-4">
            <Button variant="primary_border" @click="router.push(`/course/${courseId}/exams`)">
                View Exams
            </Button>
        </div>
    </main>
</template>