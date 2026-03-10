<script setup>
import { ref } from 'vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import Inputtext from '@/assets/inputtext.vue'
import Radioinput from '@/assets/radioinput.vue'
import { goBack } from '@/utils/navigation'
import { examAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const examId = params.get('examId')

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

const correctIndex = ref(0)

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

async function createQuestion(e) {
  e.preventDefault()
  error.value = ''
  success.value = ''

  if (!questionText.value) {
    error.value = 'Question text is required'
    return
  }

  if (choices.value.length < 4) {
    error.value = 'At least 4 choices are required'
    return
  }

  for (let i = 0; i < choices.value.length; i++) {
    if (!choices.value[i].text) {
      error.value = `Choice ${i + 1} text is required`
      return
    }
  }

  isSubmitting.value = true
  try {
    const question = {
      question_text: questionText.value,
      option_a: choices.value[0]?.text || '',
      option_b: choices.value[1]?.text || '',
      option_c: choices.value[2]?.text || '',
      option_d: choices.value[3]?.text || '',
      correct_option: optionLabels[correctIndex.value] || 'A',
    }

    await examAPI.addQuestions(examId, [question])
    success.value = 'Question created successfully!'
    questionText.value = ''
    choices.value = [
      { id: 1, text: '' },
      { id: 2, text: '' },
      { id: 3, text: '' },
      { id: 4, text: '' }
    ]
    correctIndex.value = 0
  } catch (err) {
    error.value = err.message || 'Failed to create question'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>

<main class="mt-24 mx-5">
<Button @click="goBack()" variant="primary_border">Go Back</Button>

<Contentcontainer>

<form class="flex flex-col gap-4" @submit="createQuestion">

<label class="font-semibold">
Question
</label>

<Inputtext
v-model="questionText"
input_placeholder="Enter your question here"
/>

<Button
type="button"
variant="primary_border"
@click="addChoice"
>
Add Choice
</Button>

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

<Inputtext
v-model="choice.text"
input_placeholder="Choice text"
/>

<Button
type="button"
variant="danger"
@click="removeChoice(index)"
v-if="choices.length > 2"
>
Remove
</Button>

</div>

</div>

<div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
<div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

<Button type="submit" :disabled="isSubmitting">
{{ isSubmitting ? 'Creating...' : 'Create Question' }}
</Button>

</form>

</Contentcontainer>

</main>

</template>