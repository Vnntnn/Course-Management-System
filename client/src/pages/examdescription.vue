<script setup>
import { ref, onMounted } from 'vue'
import Contentcontainer from '@/assets/contentcontainer.vue';
import Button from '@/assets/button.vue';
import { go, goBack } from '@/utils/navigation';
import { examAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const examId = params.get('examId')

const exam = ref(null)
const isLoading = ref(false)
const error = ref('')
const isEnrolled = ref(false)
const enrollChecked = ref(false)

const fetchExam = async () => {
    if (!examId.value) return
    isLoading.value = true
    error.value = ''
    try {
        const res = await examAPI.getById(examId.value)
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

const goBack = () => {
    if (exam.value?.course_id) {
        router.push(`/course/${exam.value.course_id}/exams`)
    } else {
        router.push('/dashboard')
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
        <Button variant="primary_border" @click="goBack()">
            ← Back to Exam List
        </Button>

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

        <Contentcontainer v-if="exam" class="flex justify-center items-center flex-col h-auto p-12 md:p-20 space-y-4">
            <h1 class="text-4xl font-bold text-center">{{ exam.title }}</h1>
            <p class="text-lg text-text-300">Total Questions: {{ exam.total_questions }}</p>
            <p class="text-text-400">{{ exam.questions?.length || 0 }} questions available</p>
            
            <div class="flex gap-3 pt-4">
                <Button @click="router.push(`/exam/${examId}/take`)" class="flex gap-2">
                    Start Exam
                </Button>
                <Button variant="primary_border" @click="goBack()">
                    Cancel
                </Button>
            </div>
        </Contentcontainer>
    </main>
</template>