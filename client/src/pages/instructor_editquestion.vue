<script setup>
import { ref, onMounted } from 'vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import Inputtext from '@/assets/inputtext.vue'
import Radioinput from '@/assets/radioinput.vue'
import { goBack } from '@/utils/navigation'
import { examAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const questionId = params.get('questionId')
const examId = params.get('examId')

const question = ref('')
const isLoading = ref(false)
const error = ref('')

const choices = ref([
  { id: 1, text: '' },
  { id: 2, text: '' },
  { id: 3, text: '' }
])

const correct = ref(0)

const optionKeys = ['option_a', 'option_b', 'option_c', 'option_d']
const optionLabels = ['A', 'B', 'C', 'D']

function addChoice() {
  choices.value.push({
    id: choices.value.length + 1,
    text: ''
  })
}

function removeChoice(index) {
  choices.value.splice(index, 1)
}

// Load question data from exam
const fetchQuestion = async () => {
  if (!examId) return
  isLoading.value = true
  try {
    const res = await examAPI.getById(examId)
    const questions = res.data?.questions || []
    const q = questions.find(q => q.id === parseInt(questionId))
    if (q) {
      question.value = q.question_text
      choices.value = [
        { id: 1, text: q.option_a },
        { id: 2, text: q.option_b },
        { id: 3, text: q.option_c },
        { id: 4, text: q.option_d },
      ]
      correct.value = optionLabels.indexOf(q.correct_option)
    }
  } catch (err) {
    error.value = err.message || 'Failed to load question'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchQuestion)
</script>

<template>

<main class="mt-24 mx-5 space-y-6">

<Button
variant="primary_border"
@click="goBack()"
>
Back to Exam
</Button>

<h1 class="text-4xl font-bold">
Edit Question
</h1>

<div v-if="isLoading" class="text-text-400 text-center py-8">Loading...</div>
<div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

<Contentcontainer v-if="!isLoading" class="space-y-4">

<label class="font-semibold">
Question
</label>

<Inputtext
v-model="question"
input_placeholder="Enter question"
/>

<div class="flex justify-between items-center">

<label class="font-semibold">
Choices
</label>

<Button
variant="primary_border"
type="button"
@click="addChoice"
>
Add Choice
</Button>

</div>

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

<Inputtext
v-model="choice.text"
input_placeholder="Choice text"
/>

<Button
variant="danger"
type="button"
@click="removeChoice(index)"
>
Remove
</Button>

</div>

<p class="text-text-400 text-sm">Note: Question editing (save) is not yet supported by the backend API. You can view the current data here.</p>

<Button variant="primary_border" @click="goBack()">
Back
</Button>

</Contentcontainer>

</main>

</template>