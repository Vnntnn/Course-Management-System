<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Exam from '@/components/exam.vue'
import { goBack, go } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
import { courseAPI, enrollmentAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')

const { currentUser } = useAuth()
const role = computed(() => currentUser.value?.role || 'student')

const exams = ref([])
const isLoading = ref(false)
const error = ref('')
const isEnrolled = ref(false)
const enrollChecked = ref(false)

const checkAccess = async () => {
    if (role.value === 'instructor') {
        isEnrolled.value = true
        enrollChecked.value = true
        return
    }
    if (!courseId) return
    try {
        const res = await enrollmentAPI.checkEnrollment(courseId)
        isEnrolled.value = res.data?.enrolled === true
    } catch {
        isEnrolled.value = false
    }
    enrollChecked.value = true
}

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

onMounted(async () => {
    await checkAccess()
    if (isEnrolled.value) {
        await fetchExams()
    }
})
</script>

<template>

<main class="mt-24 mx-5 space-y-5">

<Button
variant="primary_border"
@click="goBack()"
>
Back To Course
</Button>

<!-- Not enrolled guard -->
<Contentcontainer v-if="enrollChecked && !isEnrolled" class="text-center py-12 space-y-4">
    <h2 class="text-2xl font-bold">🔒 Enrollment Required</h2>
    <p class="text-text-400">You must enroll in this course before accessing exams.</p>
    <Button @click="go(`/course?courseId=${courseId}`)">
        Go to Course Page to Enroll
    </Button>
</Contentcontainer>

<template v-if="isEnrolled">

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

</template>

</main>

</template>