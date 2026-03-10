<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { goBack } from '@/utils/navigation'
import { contentAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const lessonId = params.get('lessonId')
const courseId = params.get('courseId')

const lessonName = ref('')
const lessonDesc = ref('')
const isSaving = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const sections = ref([])

// Load existing lesson topics
const fetchLesson = async () => {
  // Currently no direct "get lesson by id" endpoint, 
  // but we can load from the course lessons
  if (!courseId) return
  isLoading.value = true
  try {
    const res = await contentAPI.getCourseLessons(courseId)
    const lessons = res.data || []
    const lesson = lessons.find(l => l.id === parseInt(lessonId))
    if (lesson) {
      lessonName.value = lesson.title
      sections.value = (lesson.topics || []).map(t => ({
        id: t.id,
        text: t.content_body
      }))
      if (sections.value.length === 0) {
        sections.value = [{ id: 1, text: '' }]
      }
    }
  } catch (err) {
    error.value = err.message || 'Failed to load lesson'
  } finally {
    isLoading.value = false
  }
}

function addSection() {
  sections.value.push({
    id: Date.now(),
    text: ''
  })
}

function removeSection(index) {
  sections.value.splice(index, 1)
}

async function saveLesson() {
  error.value = ''
  success.value = ''
  isSaving.value = true
  try {
    // Create new topics for any new sections
    for (const section of sections.value) {
      if (section.text.trim() && !section.existing) {
        await contentAPI.createTopic({
          lesson_id: parseInt(lessonId),
          title: lessonName.value,
          content_type: 'text',
          content_body: section.text,
        })
      }
    }
    success.value = 'Lesson updated successfully!'
  } catch (err) {
    error.value = err.message || 'Failed to save lesson'
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchLesson)
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

<div v-if="isLoading" class="text-text-400 text-center py-8">Loading...</div>

<Contentcontainer v-else class="space-y-4">

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

<div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
<div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

<Button @click="saveLesson()" :disabled="isSaving">
{{ isSaving ? 'Saving...' : 'Save Lesson' }}
</Button>

</Contentcontainer>

</main>

</template>