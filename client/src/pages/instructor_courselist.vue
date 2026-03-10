<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
import { courseAPI } from '@/utils/api'

const router = useRouter()
const courses = ref([])
const isLoading = ref(false)
const error = ref('')
const deleteError = ref('')

const fetchCourses = async () => {
    isLoading.value = true
    error.value = ''
    try {
        const res = await courseAPI.getInstructorCourses()
        courses.value = res.data || []
    } catch (err) {
        error.value = err.message || 'Failed to load courses'
    } finally {
        isLoading.value = false
    }
}

const deleteCourse = async (id, title) => {
    deleteError.value = ''
    if (!confirm(`Delete "${title}"? This will also delete all lessons, exams, and enrollments. This cannot be undone.`)) return
    try {
        await courseAPI.delete(id, true)
        courses.value = courses.value.filter(c => c.id !== id)
    } catch (err) {
        deleteError.value = err.message || 'Failed to delete course'
    }
}

const goBack = () => router.back()

onMounted(fetchCourses)
</script>

<template>
    <main class="mt-24 mx-5 space-y-6">
        <Button variant="primary_border" @click="goBack()">
            ← Back
        </Button>

        <div class="flex justify-between items-center">
            <h1 class="text-4xl font-bold">My Courses</h1>
            <Button class="flex gap-2" @click="router.push('/instructor/course/create')">
                <HugeiconsIcon :icon="icons.Add01Icon"/>
                Create Course
            </Button>
        </div>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading courses...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>
        <div v-if="deleteError" class="text-red-500 text-center py-2">{{ deleteError }}</div>

        <Contentcontainer v-if="courses.length === 0 && !isLoading" class="text-center py-8 text-text-400">
            You haven't created any courses yet. Click "Create Course" to get started.
        </Contentcontainer>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
                v-for="course in courses"
                :key="course.id"
                class="rounded-xl bg-ci-secondary-1 overflow-hidden hover:ring-2 ring-ci-secondary-3 transition"
            >
                <img
                    :src="course.thumbnail_url || 'https://i.pinimg.com/736x/a2/31/9c/a2319c01c458e70c57ddddbc4c2244b5.jpg'"
                    class="w-full h-40 object-cover"
                />
                <div class="p-4 space-y-2">
                    <h2 class="text-xl font-bold">{{ course.title }}</h2>
                    <p class="text-text-400 text-sm line-clamp-2">{{ course.description }}</p>
                    <div class="flex gap-4 text-sm text-text-400">
                        <span>{{ course._count?.lessons || 0 }} lessons</span>
                        <span>{{ course._count?.exams || 0 }} exams</span>
                        <span>{{ course._count?.enrollments || 0 }} students</span>
                    </div>
                    <div class="flex gap-2 flex-wrap pt-2">
                        <Button size="small" @click="router.push(`/instructor/course/${course.id}/edit`)">
                            Edit
                        </Button>
                        <Button size="small" variant="primary_border" @click="router.push(`/course/${course.id}/chapters`)">
                            Lessons
                        </Button>
                        <Button size="small" variant="primary_border" @click="router.push(`/course/${course.id}/exams`)">
                            Exams
                        </Button>
                        <Button size="small" variant="danger" @click="deleteCourse(course.id, course.title)">
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
