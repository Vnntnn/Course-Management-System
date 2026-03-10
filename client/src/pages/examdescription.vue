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

const fetchExam = async () => {
    if (!examId) return
    isLoading.value = true
    try {
        const res = await examAPI.getById(examId)
        exam.value = res.data
    } catch (err) {
        error.value = err.message || 'Failed to load exam'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchExam)
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">Back to Exam List</Button>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading exam...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <Contentcontainer v-if="exam" class="flex justify-center items-center flex-col h-auto p-20">
            <h1 class="text-4xl font-bold">{{ exam.title }}</h1>
            <p class="mt-2 text-lg">จำนวนข้อ: {{ exam.total_questions }}</p>
            <p class="text-text-400 mt-2">{{ exam.questions?.length || 0 }} questions available</p>
            <Button @click="go(`/exampage?examId=${examId}`)" class="m-5">Start Exam</Button>
        </Contentcontainer>
    </main>
</template>