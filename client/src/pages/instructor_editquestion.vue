<script setup>
import { ref } from 'vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import Inputtext from '@/assets/inputtext.vue'
import Radioinput from '@/assets/radioinput.vue'
import { goBack } from '@/utils/navigation'

const question = ref('What is Vue?')

const choices = ref([
  { id: 1, text: 'A JavaScript Framework' },
  { id: 2, text: 'A CSS Library' },
  { id: 3, text: 'A Database' }
])

const correct = ref(1)

function addChoice() {
  choices.value.push({
    id: choices.value.length + 1,
    text: ''
  })
}

function removeChoice(index) {
  choices.value.splice(index, 1)
}
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

<Contentcontainer class="space-y-4">

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
:value="choice.id"
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

<Button>
Save Question
</Button>

</Contentcontainer>

</main>

</template>