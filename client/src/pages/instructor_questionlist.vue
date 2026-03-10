<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
import { examAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.examId)

const exam = ref(null)
const questions = ref([])
const isLoading = ref(false)
const error = ref('')

async function fetchExam() {
    if (!examId.value) return
    isLoading.value = true
    try {
        const res = await examAPI.getById(examId.value)
        exam.value = res.data
        questions.value = res.data?.questions || []
    } catch (err) {
        error.value = err.message || 'Failed to load questions'
    } finally {
        isLoading.value = false
    }
}

const goBack = () => router.back()
const goToQuestionCreate = () => router.push(`/instructor/exam/${examId.value}/question/create`)
const goToQuestionEdit = (questionId) => router.push(`/instructor/exam/${examId.value}/question/${questionId}/edit`)

onMounted(fetchExam)
</script>

<template>
    <main class="mt-24 mx-5 space-y-6">
        <Button variant="primary_border" @click="goBack()">
            ← Back to Exam
        </Button>

        <div class="flex justify-between items-center">
            <h1 class="text-4xl font-bold">Question List</h1>
            <Button class="flex gap-2 items-center" @click="goToQuestionCreate">
                <HugeiconsIcon :icon="icons.Add01Icon" />
                Create Question
            </Button>
        </div>

        <div v-if="isLoading" class="text-text-400 text-center py-8">
            Loading questions...
        </div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <Contentcontainer
            v-if="questions.length === 0 && !isLoading"
            class="text-center py-8 text-text-400"
        >
            No questions yet. Click "Create Question" to add some.
        </Contentcontainer>

        <Contentcontainer v-else class="space-y-4">
            <div
                v-for="(q, index) in questions"
                :key="q.id"
                class="p-4 rounded-xl bg-ci-secondary-1"
            >
                <div class="flex justify-between items-start">
                    <p class="font-semibold flex-1">
                        {{ index + 1 }}. {{ q.question_text }}
                    </p>
                    <Button variant="primary_border" @click="goToQuestionEdit(q.id)">
                        Edit
                    </Button>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div
                        :class="[
                            'p-2 rounded',
                            q.correct_option === 'A' ? 'bg-green-500/20 font-bold' : 'bg-ci-secondary-2'
                        ]"
                    >
                        A) {{ q.option_a }}
                    </div>
                    <div
                        :class="[
                            'p-2 rounded',
                            q.correct_option === 'B' ? 'bg-green-500/20 font-bold' : 'bg-ci-secondary-2'
                        ]"
                    >
                        B) {{ q.option_b }}
                    </div>
                    <div
                        :class="[
                            'p-2 rounded',
                            q.correct_option === 'C' ? 'bg-green-500/20 font-bold' : 'bg-ci-secondary-2'
                        ]"
                    >
                        C) {{ q.option_c }}
                    </div>
                    <div
                        :class="[
                            'p-2 rounded',
                            q.correct_option === 'D' ? 'bg-green-500/20 font-bold' : 'bg-ci-secondary-2'
                        ]"
                    >
                        D) {{ q.option_d }}
                    </div>
                </div>
            </div>
        </Contentcontainer>
    </main>
</template>