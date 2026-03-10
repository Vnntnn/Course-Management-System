<script setup>
import { ref, onMounted, computed } from 'vue'
import Contentcontainer from '@/assets/contentcontainer.vue';
import Button from '@/assets/button.vue';
import { go, goBack } from '@/utils/navigation';
import { examAPI, enrollmentAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const params = new URLSearchParams(window.location.search)
const examId = params.get('examId')

const { currentUser } = useAuth()
const role = computed(() => currentUser.value?.role || 'student')

const exam = ref(null)
const isLoading = ref(false)
const error = ref('')
const isEnrolled = ref(false)
const enrollChecked = ref(false)

const fetchExam = async () => {
    if (!examId) return
    isLoading.value = true
    try {
        const res = await examAPI.getById(examId)
        exam.value = res.data
    } catch (err) {
        // Backend returns 403 if not enrolled
        if (err.status === 403) {
            isEnrolled.value = false
            enrollChecked.value = true
            error.value = ''
        } else {
            error.value = err.message || 'Failed to load exam'
        }
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    // Instructors always have access
    if (role.value === 'instructor') {
        isEnrolled.value = true
        enrollChecked.value = true
    }
    await fetchExam()
    // If we got exam data, we're enrolled
    if (exam.value) {
        isEnrolled.value = true
        enrollChecked.value = true
    }
})
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">Back to Exam List</Button>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading exam...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <!-- Not enrolled guard -->
        <Contentcontainer v-if="enrollChecked && !isEnrolled" class="text-center py-12 space-y-4">
            <h2 class="text-2xl font-bold">🔒 Enrollment Required</h2>
            <p class="text-text-400">You must enroll in this course before taking exams.</p>
            <Button @click="go('/coursebrowser')">
                Browse Courses
            </Button>
        </Contentcontainer>

        <Contentcontainer v-if="exam" class="flex justify-center items-center flex-col h-auto p-20">
            <h1 class="text-4xl font-bold">{{ exam.title }}</h1>
            <p class="mt-2 text-lg">จำนวนข้อ: {{ exam.total_questions }}</p>
            <p class="text-text-400 mt-2">{{ exam.questions?.length || 0 }} questions available</p>
            <Button @click="go(`/exampage?examId=${examId}`)" class="m-5">Start Exam</Button>
        </Contentcontainer>
    </main>
</template>