<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { goBack } from '@/utils/navigation'
import { courseAPI, uploadAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')

const courseName = ref('')
const courseDesc = ref('')
const thumbnail = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref('')
const success = ref('')

function handleThumbnail(e) {
  thumbnail.value = e.target.files[0]
}

const fetchCourse = async () => {
  if (!courseId) return
  isLoading.value = true
  try {
    const res = await courseAPI.getById(courseId)
    const course = res.data
    courseName.value = course.title || ''
    courseDesc.value = course.description || ''
  } catch (err) {
    error.value = err.message || 'Failed to load course'
  } finally {
    isLoading.value = false
  }
}

async function saveCourse() {
  error.value = ''
  success.value = ''

  if (!courseName.value || !courseDesc.value) {
    error.value = 'Name and description are required'
    return
  }

  isSaving.value = true
  try {
    let thumbnail_url = undefined
    if (thumbnail.value) {
      const uploadRes = await uploadAPI.uploadImage(thumbnail.value)
      thumbnail_url = uploadRes.data?.url || uploadRes.url || ''
    }

    if (courseId) {
      await courseAPI.update(courseId, {
        title: courseName.value,
        description: courseDesc.value,
        ...(thumbnail_url && { thumbnail_url }),
      })
      success.value = 'Course updated successfully!'
    } else {
      await courseAPI.create({
        title: courseName.value,
        description: courseDesc.value,
        thumbnail_url: thumbnail_url || '',
      })
      success.value = 'Course created successfully!'
    }
  } catch (err) {
    error.value = err.message || 'Failed to save course'
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchCourse)
</script>

<template>

<main class="mt-24 mx-5 space-y-6">

<Button
variant="primary_border"
@click="goBack()"
>
Back to Course
</Button>

<h1 class="text-4xl font-bold">
{{ courseId ? 'Edit Course' : 'Create Course' }}
</h1>

<div v-if="isLoading" class="text-text-400 text-center py-8">Loading...</div>

<Contentcontainer v-else class="space-y-4">

<label class="font-semibold">
Course Name
</label>

<Inputtext
v-model="courseName"
input_placeholder="Course name"
/>

<label class="font-semibold">
Course Description
</label>

<textarea
v-model="courseDesc"
rows="5"
class="w-full p-3 rounded-lg bg-ci-secondary-1"
placeholder="Course description..."
></textarea>

<label class="font-semibold">
Thumbnail
</label>

<input
type="file"
accept="image/*"
@change="handleThumbnail"
/>

<div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
<div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

<div class="flex gap-3">

<Button @click="saveCourse()" :disabled="isSaving">
{{ isSaving ? 'Saving...' : 'Save Changes' }}
</Button>

<Button
variant="primary_border"
@click="goBack()"
>
Cancel
</Button>

</div>

</Contentcontainer>

</main>

</template>