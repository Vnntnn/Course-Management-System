<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { contentAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.courseId)

const lessonName = ref('')
const isCreating = ref(false)
const error = ref('')
const success = ref('')

const sections = ref([
    { id: 1, title: 'Section 1', text: '', contentType: 'text' }
])

function addSection() {
    sections.value.push({
        id: Date.now(),
        title: `Section ${sections.value.length + 1}`,
        text: '',
        contentType: 'text'
    })
}

function removeSection(index) {
    if (sections.value.length > 1) {
        sections.value.splice(index, 1)
    }
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
            course_id: parseInt(courseId.value),
            title: lessonName.value,
        })
        const lessonId = lessonRes.data?.id

        // Create topics from sections
        for (const section of sections.value) {
            if (section.text.trim()) {
                await contentAPI.createTopic({
                    lesson_id: lessonId,
                    title: section.title || lessonName.value,
                    content_type: section.contentType || 'text',
                    content_body: section.text,
                })
            }
        }

        success.value = 'Lesson created successfully! Redirecting...'
        setTimeout(() => router.push(`/course/${courseId.value}/chapters`), 1500)
    } catch (err) {
        error.value = err.message || 'Failed to create lesson'
    } finally {
        isCreating.value = false
    }
}

const goBack = () => router.push(`/instructor/course/${courseId.value}/edit`)
</script>

<template>
    <main class="mt-24 mx-5 space-y-6">
        <Button variant="primary_border" @click="goBack()">
            ← Back to Lessons
        </Button>

        <h1 class="text-4xl font-bold">Create Lesson</h1>

        <Contentcontainer class="space-y-4">
            <label class="font-semibold">Lesson Name</label>
            <Inputtext
                v-model="lessonName"
                input_placeholder="Enter lesson name"
            />

            <div class="flex justify-between items-center">
                <label class="font-semibold">Lesson Content</label>
                <Button variant="primary_border" type="button" @click="addSection">
                    Add Section
                </Button>
            </div>

            <div
                v-for="(section, index) in sections"
                :key="section.id"
                class="p-4 rounded-lg bg-ci-secondary-1 space-y-3"
            >
                <div class="flex justify-between items-center">
                    <Inputtext
                        v-model="section.title"
                        input_placeholder="Section title"
                        class="flex-1 mr-2"
                    />
                    <select
                        v-model="section.contentType"
                        class="p-2 rounded-lg bg-ci-secondary-2"
                    >
                        <option value="text">Text</option>
                        <option value="code">Code</option>
                        <option value="video">Video URL</option>
                    </select>
                </div>

                <textarea
                    v-model="section.text"
                    rows="5"
                    class="w-full p-3 rounded-lg bg-ci-secondary-2"
                    :placeholder="section.contentType === 'video' ? 'Enter video embed URL...' : 'Write content...'"
                ></textarea>

                <div class="flex justify-end">
                    <Button
                        v-if="sections.length > 1"
                        variant="danger"
                        type="button"
                        @click="removeSection(index)"
                    >
                        Remove Section
                    </Button>
                </div>
            </div>

            <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
            <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>

            <div class="flex gap-3">
                <Button @click="createLesson()" :disabled="isCreating">
                    {{ isCreating ? 'Creating...' : 'Create Lesson' }}
                </Button>
                <Button variant="primary_border" @click="goBack()">
                    Cancel
                </Button>
            </div>
        </Contentcontainer>
    </main>
</template>