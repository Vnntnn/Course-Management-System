<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { courseAPI, uploadAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.courseId)
const isEditMode = computed(() => !!courseId.value)

const courseName = ref('')
const courseDesc = ref('')
const thumbnail = ref(null)
const thumbnailPreview = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref('')
const success = ref('')

function handleThumbnail(e) {
    const file = e.target.files[0]
    thumbnail.value = file
    if (file) {
        thumbnailPreview.value = URL.createObjectURL(file)
    }
}

const fetchCourse = async () => {
    if (!courseId.value) return
    isLoading.value = true
    error.value = ''
    try {
        const res = await courseAPI.getById(courseId.value)
        const course = res.data
        courseName.value = course.title || ''
        courseDesc.value = course.description || ''
        thumbnailPreview.value = course.thumbnail_url || ''
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
        if (isEditMode.value) {
            // Update existing course
            await courseAPI.update(courseId.value, {
                title: courseName.value,
                description: courseDesc.value,
            })

            // Upload thumbnail separately if changed
            if (thumbnail.value) {
                await uploadAPI.uploadImage(thumbnail.value, courseId.value)
            }

            success.value = 'Course updated successfully!'
        } else {
            // Create new course
            const res = await courseAPI.create({
                title: courseName.value,
                description: courseDesc.value,
                thumbnail_url: '',
            })
            const newCourseId = res.data?.id

            // Upload thumbnail for new course
            if (thumbnail.value && newCourseId) {
                await uploadAPI.uploadImage(thumbnail.value, newCourseId)
            }

            success.value = 'Course created! Redirecting...'
            setTimeout(() => router.push('/instructor/courses'), 1500)
        }
    } catch (err) {
        error.value = err.message || 'Failed to save course'
    } finally {
        isSaving.value = false
    }
}

const goBack = () => router.back()

onMounted(fetchCourse)
</script>

<template>
    <main class="mt-24 mx-5 space-y-6">
        <Button variant="primary_border" @click="goBack()">
            ← Back
        </Button>

        <h1 class="text-4xl font-bold">
            {{ isEditMode ? 'Edit Course' : 'Create Course' }}
        </h1>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading...</div>

        <Contentcontainer v-else class="space-y-4">
            <label class="font-semibold">Course Name</label>
            <Inputtext
                v-model="courseName"
                input_placeholder="Enter course name"
            />

            <label class="font-semibold">Course Description</label>
            <textarea
                v-model="courseDesc"
                rows="5"
                class="w-full p-3 rounded-lg bg-ci-secondary-1"
                placeholder="Enter course description..."
            ></textarea>

            <label class="font-semibold">Thumbnail</label>
            <img
                v-if="thumbnailPreview"
                :src="thumbnailPreview"
                class="w-48 h-32 object-cover rounded-lg"
            />
            <input
                type="file"
                accept="image/*"
                @change="handleThumbnail"
            />

            <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
            <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

            <div class="flex gap-3">
                <Button @click="saveCourse()" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Course') }}
                </Button>
                <Button variant="primary_border" @click="goBack()">
                    Cancel
                </Button>
            </div>

            <!-- Quick links when editing existing course -->
            <div v-if="isEditMode" class="flex gap-3 pt-4 border-t border-ci-secondary-2">
                <Button variant="primary_border" @click="router.push(`/course/${courseId}/chapters`)">
                    Manage Lessons
                </Button>
                <Button variant="primary_border" @click="router.push(`/course/${courseId}/exams`)">
                    Manage Exams
                </Button>
            </div>
        </Contentcontainer>
    </main>
</template>