<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Exam from '@/components/exam.vue'
import { goBack, go } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
import { courseAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.courseId)

const { currentUser } = useAuth()
const role = computed(() => currentUser.value?.role || 'student')
const isInstructor = computed(() => role.value === 'instructor')

const course = ref(null)
const exams = ref([])
const isLoading = ref(false)
const error = ref('')
const isEnrolled = ref(false)
const enrollChecked = ref(false)

const checkAccess = async () => {
    if (role.value === 'instructor') {
        isEnrolled.value = true
        enrollChecked.value = true
        return
    }
    if (!courseId) return
    try {
        const res = await enrollmentAPI.checkEnrollment(courseId)
        isEnrolled.value = res.data?.enrolled === true
    } catch {
        isEnrolled.value = false
    }
    enrollChecked.value = true
}

const fetchExams = async () => {
    if (!courseId.value) return
    isLoading.value = true
    error.value = ''
    try {
        const res = await courseAPI.getById(courseId.value, true)
        course.value = res.data
        exams.value = res.data?.exams || []
    } catch (err) {
        error.value = err.message || 'Failed to load exams'
    } finally {
        isLoading.value = false
    }
}

const goBack = () => router.push(`/course/${courseId.value}/chapters`)

onMounted(async () => {
    await checkAccess()
    if (isEnrolled.value) {
        await fetchExams()
    }
})
</script>

<template>

<main class="mt-24 mx-5 space-y-5">

<Button
variant="primary_border"
@click="goBack()"
>
Back To Course
</Button>

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-4xl font-bold">{{ course?.title || 'Exams' }}</h1>
                <p class="text-text-400">{{ exams.length }} exam(s)</p>
            </div>

            <Button
                v-if="isInstructor"
                class="flex gap-2"
                @click="router.push(`/instructor/course/${courseId}/exam/create`)"
            >
                <HugeiconsIcon :icon="icons.Add01Icon"/>
                Create Exam
            </Button>
        </div>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading exams...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <Contentcontainer v-if="exams.length === 0 && !isLoading" class="text-center py-8 text-text-400">
            No exams for this course yet.
        </Contentcontainer>

<Contentcontainer v-else class="space-y-4">

<Exam
    v-for="(exam, index) in exams"
    :key="exam.id"
    :number="String(index + 1)"
    :count="String(exam.total_questions || 0)"
    :role="role"
    :examId="exam.id"
    :courseId="courseId"
/>

</Contentcontainer>

        <!-- Navigation -->
        <div class="flex gap-3 pt-4">
            <Button variant="primary_border" @click="router.push(`/course/${courseId}/chapters`)">
                View Lessons
            </Button>
        </div>
    </main>
</template>