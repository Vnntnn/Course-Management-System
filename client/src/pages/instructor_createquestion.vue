<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import Inputtext from '@/assets/inputtext.vue'
import Radioinput from '@/assets/radioinput.vue'
import { examAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const examId = computed(() => route.params.examId)

const questionText = ref('')
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

const choices = ref([
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' },
    { id: 4, text: '' }
])

const correctIndex = ref(-1) // -1 means not selected
const getOptionLabel = (index) => String.fromCharCode(65 + index) // A, B, C, D, E...

function addChoice() {
    choices.value.push({
        id: Date.now(),
        text: ''
    })
}

function removeChoice(index) {
    if (choices.value.length > 2) {
        choices.value.splice(index, 1)
        // Adjust correctIndex if needed
        if (correctIndex.value >= choices.value.length) {
            correctIndex.value = choices.value.length - 1
        }
    }
}

async function createQuestion(e) {
    e.preventDefault()
    error.value = ''
    success.value = ''

    if (!questionText.value.trim()) {
        error.value = 'Question text is required'
        return
    }

    if (choices.value.length < 4) {
        error.value = 'At least 4 choices are required'
        return
    }

    for (let i = 0; i < choices.value.length; i++) {
        if (!choices.value[i].text.trim()) {
            error.value = `Choice ${getOptionLabel(i)} text is required`
            return
        }
    }

    if (correctIndex.value < 0) {
        error.value = 'Please select the correct answer'
        return
    }

    isSubmitting.value = true
    try {
        const question = {
            question_text: questionText.value,
            option_a: choices.value[0]?.text || '',
            option_b: choices.value[1]?.text || '',
            option_c: choices.value[2]?.text || '',
            option_d: choices.value[3]?.text || '',
            correct_option: getOptionLabel(correctIndex.value),
        }

        await examAPI.addQuestions(examId.value, [question])
        success.value = 'Question created successfully!'
        
        // Reset form
        questionText.value = ''
        choices.value = [
            { id: 1, text: '' },
            { id: 2, text: '' },
            { id: 3, text: '' },
            { id: 4, text: '' }
        ]
        correctIndex.value = -1
    } catch (err) {
        error.value = err.message || 'Failed to create question'
    } finally {
        isSubmitting.value = false
    }
}

const goBack = () => router.push(`/instructor/exam/${examId.value}/questions`)
const goToExam = () => router.push(`/instructor/exam/${examId.value}/questions`)
</script>

<template>
    <main class="mt-24 mx-5 space-y-6">
        <Button @click="goBack()" variant="primary_border">
            ← Back to Exam
        </Button>

        <h1 class="text-4xl font-bold">Create Question</h1>

        <Contentcontainer>
            <form class="flex flex-col gap-4" @submit="createQuestion">
                <label class="font-semibold">Question</label>
                <Inputtext
                    v-model="questionText"
                    input_placeholder="Enter your question here"
                />

                <div class="flex justify-between items-center">
                    <label class="font-semibold">Choices (select correct answer)</label>
                    <Button type="button" variant="primary_border" @click="addChoice">
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
                            v-model="correctIndex"
                        />
                        <span class="font-semibold w-6">{{ getOptionLabel(index) }})</span>
                        <Inputtext
                            v-model="choice.text"
                            input_placeholder="Choice text"
                            class="flex-1"
                        />
                        <Button
                            v-if="choices.length > 2"
                            type="button"
                            variant="danger"
                            @click="removeChoice(index)"
                        >
                            Remove
                        </Button>
                    </div>
                </div>

                <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
                <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

                <div class="flex gap-3">
                    <Button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Creating...' : 'Create Question' }}
                    </Button>
                    <Button type="button" variant="primary_border" @click="goToExam">
                        Done Adding Questions
                    </Button>
                </div>
            </form>
        </Contentcontainer>
    </main>
</template>