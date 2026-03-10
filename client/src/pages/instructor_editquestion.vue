<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import Inputtext from '@/assets/inputtext.vue'
import Radioinput from '@/assets/radioinput.vue'
import { examAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.examId)
const questionId = computed(() => route.params.questionId)

const question = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref('')
const success = ref('')

const choices = ref([
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' },
    { id: 4, text: '' }
])

const correct = ref(0)
const optionLabels = ['A', 'B', 'C', 'D']

function addChoice() {
    choices.value.push({
        id: Date.now(),
        text: ''
    })
}

function removeChoice(index) {
    if (choices.value.length > 2) {
        choices.value.splice(index, 1)
        if (correct.value >= choices.value.length) {
            correct.value = choices.value.length - 1
        }
    }
}

async function fetchQuestion() {
    if (!examId.value) return
    isLoading.value = true
    try {
        const res = await examAPI.getById(examId.value)
        const questions = res.data?.questions || []
        const q = questions.find(q => q.id === parseInt(questionId.value))
        if (q) {
            question.value = q.question_text
            choices.value = [
                { id: 1, text: q.option_a },
                { id: 2, text: q.option_b },
                { id: 3, text: q.option_c },
                { id: 4, text: q.option_d },
            ]
            correct.value = optionLabels.indexOf(q.correct_option)
            if (correct.value < 0) correct.value = 0
        }
    } catch (err) {
        error.value = err.message || 'Failed to load question'
    } finally {
        isLoading.value = false
    }
}

async function saveQuestion() {
    error.value = ''
    success.value = ''

    if (!question.value.trim()) {
        error.value = 'Question text is required'
        return
    }

    for (let i = 0; i < 4; i++) {
        if (!choices.value[i]?.text?.trim()) {
            error.value = `Choice ${optionLabels[i]} is required`
            return
        }
    }

    isSaving.value = true
    try {
        await examAPI.updateQuestion(questionId.value, {
            question_text: question.value,
            option_a: choices.value[0]?.text || '',
            option_b: choices.value[1]?.text || '',
            option_c: choices.value[2]?.text || '',
            option_d: choices.value[3]?.text || '',
            correct_option: optionLabels[correct.value] || 'A',
        })
        success.value = 'Question updated successfully!'
    } catch (err) {
        error.value = err.message || 'Failed to update question'
    } finally {
        isSaving.value = false
    }
}

const goBack = () => router.back()
const goToExam = () => router.push(`/instructor/exam/${examId.value}`)

onMounted(fetchQuestion)
</script>

<template>
    <main class="mt-24 mx-5 space-y-6">
        <Button variant="primary_border" @click="goBack()">
            ← Back to Exam
        </Button>

        <h1 class="text-4xl font-bold">Edit Question</h1>

        <div v-if="isLoading" class="text-text-400 text-center py-8">
            Loading question...
        </div>
        <div v-if="error && !isLoading" class="text-red-500 text-center py-4">{{ error }}</div>

        <Contentcontainer v-if="!isLoading" class="space-y-4">
            <label class="font-semibold">Question</label>
            <Inputtext
                v-model="question"
                input_placeholder="Enter question"
            />

            <div class="flex justify-between items-center">
                <label class="font-semibold">Choices (select correct answer)</label>
                <Button variant="primary_border" type="button" @click="addChoice">
                    Add Choice
                </Button>
            </div>

            <div class="flex flex-col gap-3">
                <div
                    v-for="(choice, index) in choices"
                    :key="choice.id"
                    class="flex items-center gap-3"
                >
                    <Radioinput
                        name="correct"
                        :value="index"
                        v-model="correct"
                    />
                    <span class="font-semibold w-6">{{ optionLabels[index] || index + 1 }})</span>
                    <Inputtext
                        v-model="choice.text"
                        input_placeholder="Choice text"
                        class="flex-1"
                    />
                    <Button
                        v-if="choices.length > 2"
                        variant="danger"
                        type="button"
                        @click="removeChoice(index)"
                    >
                        Remove
                    </Button>
                </div>
            </div>

            <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
            <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

            <div class="flex gap-3">
                <Button @click="saveQuestion()" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : 'Save Question' }}
                </Button>
                <Button variant="primary_border" @click="goToExam">
                    Back to Exam
                </Button>
            </div>
        </Contentcontainer>
    </main>
</template>