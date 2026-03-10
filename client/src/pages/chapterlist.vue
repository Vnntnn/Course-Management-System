<script setup>
import { ref, onMounted, computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import { go, goBack } from '@/utils/navigation'
import { courseAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')

const { currentUser } = useAuth()
const role = computed(() => currentUser.value?.role || 'student')

const course = ref(null)
const lessons = ref([])
const isLoading = ref(false)
const error = ref('')

const fetchCourse = async () => {
    if (!courseId) return
    isLoading.value = true
    try {
        const res = await courseAPI.getById(courseId)
        course.value = res.data
        lessons.value = res.data?.lessons || []
    } catch (err) {
        error.value = err.message || 'Failed to load lessons'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchCourse)
</script>

<template>

<main class="mt-24 mx-5">

<Button
variant="primary_border"
@click="goBack()"
>
Back to Course List
</Button>

<div class="flex justify-between items-center p-5">

<h1 class="text-4xl font-bold">
Lessons
</h1>

<Button
v-if="role === 'instructor'"
class="flex gap-2"
@click="go(`/chaptercreate?courseId=${courseId}`)"
>

<HugeiconsIcon :icon="icons.Add01Icon"/>

Create

</Button>

</div>

<div v-if="isLoading" class="text-text-400 text-center py-8">Loading lessons...</div>
<div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

<Contentcontainer v-if="lessons.length === 0 && !isLoading" class="text-center py-8 text-text-400">
    No lessons in this course yet.
</Contentcontainer>

<Contentcontainer v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

<div
    v-for="(lesson, index) in lessons"
    :key="lesson.id"
    class="rounded-xl p-4 hover:ring-2 bg-ci-secondary-1 ring-ci-secondary-3"
>
    <h1 class="text-2xl font-semibold mt-2">
        Chapter {{ index + 1 }} - {{ lesson.title }}
    </h1>
    <p class="p-3 text-text-400">
        {{ lesson.topics?.length || 0 }} topics
    </p>

    <div class="flex gap-2">
        <Button @click="go(`/details?courseId=${courseId}&lessonId=${lesson.id}`)">
            {{ role === 'instructor' ? 'Manage' : 'Read' }}
        </Button>
        <Button
            v-if="role === 'instructor'"
            variant="primary_border"
            @click="go(`/chapteredit?courseId=${courseId}&lessonId=${lesson.id}`)"
        >
            Edit
        </Button>
    </div>
</div>

</Contentcontainer>

</main>

</template>