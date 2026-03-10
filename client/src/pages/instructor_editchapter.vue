<script setup>
import { ref } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { goBack } from '@/utils/navigation'

const lessonName = ref('Introduction to Vue')
const lessonDesc = ref('Basic concept of Vue framework')

const sections = ref([
  { id: 1, text: 'Vue is a progressive JavaScript framework...' },
  { id: 2, text: 'Vue focuses on building user interfaces...' }
])

function addSection() {
  sections.value.push({
    id: sections.value.length + 1,
    text: ''
  })
}

function removeSection(index) {
  sections.value.splice(index, 1)
}
</script>

<template>

<main class="mt-24 mx-5 space-y-6">

<Button
variant="primary_border"
@click="goBack()"
>
Back to Chapter
</Button>

<h1 class="text-4xl font-bold">
Edit Lesson
</h1>

<Contentcontainer class="space-y-4">

<label class="font-semibold">
Lesson Name
</label>

<Inputtext
v-model="lessonName"
input_placeholder="Lesson name"
/>

<label class="font-semibold">
Lesson Description
</label>

<Inputtext
v-model="lessonDesc"
input_placeholder="Lesson description"
/>

<div class="flex justify-between items-center">

<label class="font-semibold">
Lesson Content
</label>

<Button
variant="primary_border"
type="button"
@click="addSection"
>
Add Section
</Button>

</div>

<div
v-for="(section, index) in sections"
:key="section.id"
class="flex flex-col gap-2"
>

<textarea
v-model="section.text"
rows="5"
class="w-full p-3 rounded-lg bg-ci-secondary-1"
placeholder="Lesson content..."
></textarea>

<div class="flex justify-end">

<Button
variant="danger"
type="button"
@click="removeSection(index)"
>
Remove
</Button>

</div>

</div>

<Button>
Save Lesson
</Button>

</Contentcontainer>

</main>

</template>