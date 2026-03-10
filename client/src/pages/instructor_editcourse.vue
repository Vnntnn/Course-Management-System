<script setup>
import { ref } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { goBack } from '@/utils/navigation'

const courseName = ref('Introduction to Web Development')
const courseDesc = ref('Learn the fundamentals of web development including HTML, CSS, and JavaScript.')
const thumbnail = ref(null)

function handleThumbnail(e) {
  thumbnail.value = e.target.files[0]
}

function saveCourse() {
  console.log({
    name: courseName.value,
    description: courseDesc.value,
    thumbnail: thumbnail.value
  })
}
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
Edit Course
</h1>

<Contentcontainer class="space-y-4">

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

<div class="flex gap-3">

<Button @click="saveCourse()">
Save Changes
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