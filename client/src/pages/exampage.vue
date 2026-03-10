<script setup>
import { ref, onMounted } from 'vue'
import Contentcontainer from '@/assets/contentcontainer.vue';
import Button from '@/assets/button.vue';
import { go, goBack } from '@/utils/navigation';
import { examAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const examId = params.get('examId')

const exam = ref(null)
const questions = ref([])
const answers = ref({})
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const fetchExam = async () => {
    if (!examId) return
    isLoading.value = true
    try {
        const res = await examAPI.getById(examId)
        exam.value = res.data
        questions.value = res.data?.questions || []
    } catch (err) {
        error.value = err.message || 'Failed to load exam'
    } finally {
        isLoading.value = false
    }
}

const selectAnswer = (questionId, option) => {
    answers.value[questionId] = option
}

const submitExam = async () => {
    error.value = ''

    // Build answers array: [{question_id, selected_option}]
    const answerList = questions.value.map(q => ({
        question_id: q.id,
        selected_option: answers.value[q.id] || ''
    }))

    // Check if all answered
    const unanswered = answerList.filter(a => !a.selected_option)
    if (unanswered.length > 0) {
        if (!confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
            return
        }
    }

    isSubmitting.value = true
    try {
        const res = await examAPI.submit(examId, answerList)
        const result = res.data
        // Navigate to result page with score
        go(`/examresult?score=${result.score || 0}&maxscore=${questions.value.length}&examId=${examId}`)
    } catch (err) {
        error.value = err.message || 'Failed to submit exam'
    } finally {
        isSubmitting.value = false
    }
}

onMounted(fetchExam)
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">

        <Button variant="primary_border" @click="goBack()">← Back</Button>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading exam...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <template v-if="exam && !isLoading">
            <h1 class="text-3xl font-bold">{{ exam.title }}</h1>
            <p class="text-text-400">{{ questions.length }} question(s)</p>

            <Contentcontainer
                v-for="(q, index) in questions"
                :key="q.id"
                class="space-y-3"
            >
                <h2 class="text-lg font-semibold">{{ index + 1 }}. {{ q.question_text }}</h2>

                <div class="flex flex-col gap-2">
                    <label
                        v-for="opt in ['A', 'B', 'C', 'D']"
                        :key="opt"
                        :class="[
                            'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition',
                            answers[q.id] === opt
                                ? 'bg-ci-primary text-text-100'
                                : 'bg-ci-secondary-1 hover:bg-ci-secondary-2'
                        ]"
                        @click="selectAnswer(q.id, opt)"
                    >
                        <input
                            type="radio"
                            :name="`q_${q.id}`"
                            :value="opt"
                            :checked="answers[q.id] === opt"
                            class="sr-only"
                        />
                        <span class="font-bold">{{ opt }})</span>
                        <span>{{ q[`option_${opt.toLowerCase()}`] }}</span>
                    </label>
                </div>
            </Contentcontainer>

            <div class="pb-8">
                <Button @click="submitExam" :disabled="isSubmitting" class="flex gap-2">
                    {{ isSubmitting ? 'Submitting...' : 'Submit Exam' }}
                </Button>
            </div>
        </template>
    </main>
</template>