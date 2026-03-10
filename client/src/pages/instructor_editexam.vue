<script setup>
import { ref, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { go, goBack } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
import { examAPI, courseAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const examId = params.get('examId')
const courseId = params.get('courseId')

const exam = ref(null)
const examName = ref('')
const totalQuestions = ref(10)
const questions = ref([])
const isLoading = ref(false)
const isCreating = ref(false)
const error = ref('')
const success = ref('')

// Mode: view existing exam OR create new exam
const isCreateMode = !examId

const fetchExam = async () => {
  if (!examId) return
  isLoading.value = true
  try {
    const res = await examAPI.getById(examId)
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

const createExam = async () => {
  error.value = ''
  success.value = ''

  if (!examName.value) {
    error.value = 'Exam name is required'
    return
  }

  // Need a courseId to create exam
  const cId = courseId || exam.value?.course_id
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
    setTimeout(() => go(`/exammanage?examId=${newExamId}`), 1000)
  } catch (err) {
    error.value = err.message || 'Failed to create exam'
  } finally {
    isCreating.value = false
  }
}

onMounted(fetchExam)
</script>

<template>

<main class="mt-24 mx-5 space-y-6">

<Button
variant="primary_border"
@click="goBack()"
>
← Back
</Button>

<h1 class="text-4xl font-bold">
{{ isCreateMode ? 'Create Exam' : 'Manage Exam' }}
</h1>

<div v-if="isLoading" class="text-text-400 text-center py-8">Loading...</div>
<div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

<!-- CREATE MODE -->
<Contentcontainer v-if="isCreateMode" class="space-y-4">

<label class="font-semibold">
Exam Name
</label>
<Inputtext v-model="examName" input_placeholder="Enter exam name"/>

<label class="font-semibold">
Total Questions
</label>
<Inputtext v-model="totalQuestions" input_placeholder="Number of questions" input_type="number"/>

<div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

<Button @click="createExam()" :disabled="isCreating">
{{ isCreating ? 'Creating...' : 'Create Exam' }}
</Button>

</Contentcontainer>

<!-- VIEW/MANAGE MODE -->
<template v-if="!isCreateMode && exam">

<Contentcontainer class="space-y-4">

<label class="font-semibold">
Exam Name
</label>

<Inputtext v-model="examName" input_placeholder="Enter exam name"/>

<p class="text-text-400 text-sm">Total questions: {{ exam.total_questions }} | Added: {{ questions.length }}</p>

</Contentcontainer>

<div class="flex justify-between items-center">

<h2 class="text-3xl font-bold">
Questions
</h2>

<Button
class="flex gap-2"
@click="go(`/questioncreate?examId=${examId}`)"
>

<HugeiconsIcon :icon="icons.Add01Icon"/>

Add Question

</Button>

</div>

<Contentcontainer v-if="questions.length === 0" class="text-center py-8 text-text-400">
  No questions yet. Click "Add Question" to add questions.
</Contentcontainer>

<Contentcontainer v-else class="space-y-4">

<div
  v-for="(q, index) in questions"
  :key="q.id"
  class="p-4 rounded-xl bg-ci-secondary-1 flex justify-between items-center"
>

<div>
  <span class="font-semibold">{{ index + 1 }}.</span> {{ q.question_text }}
  <span class="text-text-400 text-sm ml-2">(Answer: {{ q.correct_option }})</span>
</div>

<Button
variant="primary_border"
@click="go(`/questionedit?questionId=${q.id}&examId=${examId}`)"
>
Edit
</Button>

</div>

</Contentcontainer>

</template>

</main>

</template>