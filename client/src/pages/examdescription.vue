<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import { examAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.examId)

const exam = ref(null)
const isLoading = ref(false)
const error = ref('')

const fetchExam = async () => {
    if (!examId.value) return
    isLoading.value = true
    error.value = ''
    try {
        const res = await examAPI.getById(examId.value)
        exam.value = res.data
    } catch (err) {
        error.value = err.message || 'Failed to load exam'
    } finally {
        isLoading.value = false
    }
}

const goBack = () => router.back()

onMounted(fetchExam)
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">
            ← Back to Exam List
        </Button>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading exam...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

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