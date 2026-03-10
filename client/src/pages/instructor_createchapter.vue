<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { goBack } from '@/utils/navigation'
import { contentAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')

const lessonName = ref('')
const lessonDesc = ref('')
const isCreating = ref(false)
const error = ref('')
const success = ref('')

const sections = ref([
  { id: 1, text: '' }
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

async function createLesson() {
  error.value = ''
  success.value = ''

  if (!lessonName.value) {
    error.value = 'Lesson name is required'
    return
  }

  isCreating.value = true
  try {
    // Create the lesson
    const lessonRes = await contentAPI.createLesson({
      course_id: parseInt(courseId),
      title: lessonName.value,
    })
    const lessonId = lessonRes.data?.id

    // Create topics from sections
    for (const section of sections.value) {
      if (section.text.trim()) {
        await contentAPI.createTopic({
          lesson_id: lessonId,
          title: lessonName.value,
          content_type: 'text',
          content_body: section.text,
        })
      }
    }

    success.value = 'Lesson created successfully!'
    lessonName.value = ''
    lessonDesc.value = ''
    sections.value = [{ id: 1, text: '' }]
  } catch (err) {
    error.value = err.message || 'Failed to create lesson'
  } finally {
    isCreating.value = false
  }
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
Create Lesson
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
placeholder="Write lesson content..."
></textarea>

<div class="flex justify-end">

<Button
variant="danger"
type="button"
@click="removeSection(index)"
v-if="sections.length > 1"
>
Remove
</Button>

</div>

</div>

<div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
<div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

<Button @click="createLesson()" :disabled="isCreating">
{{ isCreating ? 'Creating...' : 'Create Lesson' }}
</Button>

</Contentcontainer>

</main>

</template>