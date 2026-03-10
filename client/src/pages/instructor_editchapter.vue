<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { contentAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.courseId)
const lessonId = computed(() => route.params.lessonId)

const lessonName = ref('')
const isSaving = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const sections = ref([])

async function fetchLesson() {
    if (!courseId.value) return
    isLoading.value = true
    try {
        const res = await contentAPI.getCourseLessons(courseId.value)
        const lessons = res.data || []
        const lesson = lessons.find(l => l.id === parseInt(lessonId.value))
        if (lesson) {
            lessonName.value = lesson.title
            sections.value = (lesson.topics || []).map(t => ({
                id: t.id,
                title: t.title || 'Section',
                text: t.content_body || '',
                contentType: t.content_type || 'text',
                existing: true
            }))
            if (sections.value.length === 0) {
                sections.value = [{ id: Date.now(), title: 'Section 1', text: '', contentType: 'text' }]
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

async function saveLesson() {
    error.value = ''
    success.value = ''
    isSaving.value = true
    try {
        // Update lesson title
        await contentAPI.updateLesson(lessonId.value, {
            title: lessonName.value
        })

        // Create new topics for any new sections
        for (const section of sections.value) {
            if (section.text.trim() && !section.existing) {
                await contentAPI.createTopic({
                    lesson_id: parseInt(lessonId.value),
                    title: section.title || lessonName.value,
                    content_type: section.contentType || 'text',
                    content_body: section.text,
                })
            }
        }
        
        success.value = 'Lesson updated successfully! Redirecting...'
        setTimeout(() => router.push(`/course/${courseId.value}/chapters`), 1500)
    } catch (err) {
        error.value = err.message || 'Failed to save lesson'
    } finally {
        isSaving.value = false
    }
}

const goBack = () => router.push(`/instructor/course/${courseId.value}/edit`)

onMounted(fetchLesson)
</script>

<template>
    <main class="mt-24 mx-5 space-y-6">
        <Button variant="primary_border" @click="goBack()">
            ← Back to Lessons
        </Button>

        <h1 class="text-4xl font-bold">Edit Lesson</h1>

        <div v-if="isLoading" class="text-text-400 text-center py-8">
            Loading lesson...
        </div>

        <Contentcontainer v-else class="space-y-4">
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
                <Button @click="saveLesson()" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : 'Save Lesson' }}
                </Button>
                <Button variant="primary_border" @click="goBack()">
                    Cancel
                </Button>
            </div>
        </Contentcontainer>
    </main>
</template>