<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
import { examAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()

const examId = computed(() => route.params.examId)
const courseId = computed(() => route.params.courseId)
const isCreateMode = computed(() => !examId.value)

const exam = ref(null)
const examName = ref('')
const totalQuestions = ref(10)
const questions = ref([])
const isLoading = ref(false)
const isCreating = ref(false)
const error = ref('')
const success = ref('')

async function fetchExam() {
    if (!examId.value) return
    isLoading.value = true
    try {
        const res = await examAPI.getById(examId.value)
        exam.value = res.data
        examName.value = res.data?.title || ''
        questions.value = res.data?.questions || []
        totalQuestions.value = res.data?.total_questions || 10
    } catch (err) {
        error.value = err.message || 'Failed to load exam'
    } finally {
        isLoading.value = false
    }
}

async function createExam() {
    error.value = ''
    success.value = ''

    if (!examName.value) {
        error.value = 'Exam name is required'
        return
    }

    const cId = courseId.value || exam.value?.course_id
    if (!cId) {
        error.value = 'Course ID is required to create an exam'
        return
    }

    isCreating.value = true
    try {
        const res = await examAPI.create({
            course_id: parseInt(cId),
            title: examName.value,
            total_questions: parseInt(totalQuestions.value) || 10,
        })
        success.value = 'Exam created! Redirecting to add questions...'
        const newExamId = res.data?.id
        setTimeout(() => router.push(`/instructor/exam/${newExamId}`), 1500)
    } catch (err) {
        error.value = err.message || 'Failed to create exam'
    } finally {
        isCreating.value = false
    }
}

async function saveExam() {
    error.value = ''
    success.value = ''
    isCreating.value = true
    try {
        await examAPI.update(examId.value, {
            title: examName.value,
            total_questions: parseInt(totalQuestions.value) || 10,
        })
        success.value = 'Exam updated successfully!'
    } catch (err) {
        error.value = err.message || 'Failed to update exam'
    } finally {
        isCreating.value = false
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
            ← Back
        </Button>

        <h1 class="text-4xl font-bold">
            {{ isCreateMode ? 'Create Exam' : 'Manage Exam' }}
        </h1>

        <div v-if="isLoading" class="text-text-400 text-center py-8">
            Loading exam...
        </div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <!-- CREATE MODE -->
        <Contentcontainer v-if="isCreateMode" class="space-y-4">
            <label class="font-semibold">Exam Name</label>
            <Inputtext v-model="examName" input_placeholder="Enter exam name" />

            <label class="font-semibold">Total Questions</label>
            <Inputtext
                v-model="totalQuestions"
                input_placeholder="Number of questions"
                input_type="number"
            />

            <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

            <Button @click="createExam()" :disabled="isCreating">
                {{ isCreating ? 'Creating...' : 'Create Exam' }}
            </Button>
        </Contentcontainer>

        <!-- VIEW/MANAGE MODE -->
        <template v-if="!isCreateMode && exam">
            <Contentcontainer class="space-y-4">
                <label class="font-semibold">Exam Name</label>
                <Inputtext v-model="examName" input_placeholder="Enter exam name" />

                <label class="font-semibold">Total Questions</label>
                <Inputtext
                    v-model="totalQuestions"
                    input_placeholder="Number of questions"
                    input_type="number"
                />

                <p class="text-text-400 text-sm">
                    Target: {{ totalQuestions }} questions | Added: {{ questions.length }}
                </p>

                <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

                <Button @click="saveExam()" :disabled="isCreating">
                    {{ isCreating ? 'Saving...' : 'Save Exam' }}
                </Button>
            </Contentcontainer>

            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold">Questions</h2>
                <Button class="flex gap-2 items-center" @click="goToQuestionCreate">
                    <HugeiconsIcon :icon="icons.Add01Icon" />
                    Add Question
                </Button>
            </div>

            <Contentcontainer
                v-if="questions.length === 0"
                class="text-center py-8 text-text-400"
            >
                No questions yet. Click "Add Question" to add questions.
            </Contentcontainer>

            <Contentcontainer v-else class="space-y-4">
                <div
                    v-for="(q, index) in questions"
                    :key="q.id"
                    class="p-4 rounded-xl bg-ci-secondary-1 flex justify-between items-center"
                >
                    <div>
                        <span class="font-semibold">{{ index + 1 }}.</span>
                        {{ q.question_text }}
                        <span class="text-text-400 text-sm ml-2">
                            (Answer: {{ q.correct_option }})
                        </span>
                    </div>
                    <Button variant="primary_border" @click="goToQuestionEdit(q.id)">
                        Edit
                    </Button>
                </div>
            </Contentcontainer>
        </template>
    </main>
</template>