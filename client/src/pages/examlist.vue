<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Exam from '@/components/exam.vue'
import { goBack, go } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
import { courseAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')

const { currentUser } = useAuth()
const role = computed(() => currentUser.value?.role || 'student')

const exams = ref([])
const isLoading = ref(false)
const error = ref('')

const fetchExams = async () => {
    if (!courseId) return
    isLoading.value = true
    try {
        const res = await courseAPI.getById(courseId)
        exams.value = res.data?.exams || []
    } catch (err) {
        error.value = err.message || 'Failed to load exams'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchExams)
</script>

<template>

<main class="mt-24 mx-5 space-y-5">

<Button
variant="primary_border"
@click="goBack()"
>
Back To Course
</Button>

<div class="flex justify-between items-center">

<h1 class="text-4xl font-bold">
Exam List
</h1>

<Button
v-if="role === 'instructor'"
class="flex gap-2"
@click="go(`/exammanage?courseId=${courseId}`)"
>
<HugeiconsIcon :icon="icons.Add01Icon"/>
Create Exam
</Button>

</div>

<div v-if="isLoading" class="text-text-400 text-center py-8">Loading exams...</div>
<div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

<Contentcontainer v-if="exams.length === 0 && !isLoading" class="text-center py-8 text-text-400">
    No exams for this course yet.
</Contentcontainer>

<Contentcontainer v-else class="space-y-4">

<Exam
    v-for="(exam, index) in exams"
    :key="exam.id"
    :number="String(index + 1)"
    :count="String(exam.total_questions || 0)"
    :role="role"
    :examId="exam.id"
    :courseId="courseId"
/>

</Contentcontainer>

</main>

</template>