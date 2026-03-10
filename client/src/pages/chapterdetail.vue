<script setup>
import { ref, onMounted } from 'vue'
import Button from '@/assets/button.vue';
import Contentcontainer from '@/assets/contentcontainer.vue';
import { go, goBack } from '@/utils/navigation';
import { courseAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')
const lessonId = params.get('lessonId')

const lesson = ref(null)
const topics = ref([])
const isLoading = ref(false)
const error = ref('')

const fetchLesson = async () => {
    if (!courseId || !lessonId) return
    isLoading.value = true
    try {
        const res = await courseAPI.getById(courseId)
        const course = res.data
        const found = course?.lessons?.find(l => l.id === parseInt(lessonId))
        if (found) {
            lesson.value = found
            topics.value = found.topics || []
        } else {
            error.value = 'Lesson not found'
        }
    } catch (err) {
        error.value = err.message || 'Failed to load lesson'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchLesson)
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">← Go Back</Button>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

        <template v-if="lesson">
            <h1 class="text-4xl font-bold">{{ lesson.title }}</h1>

            <Contentcontainer v-if="topics.length === 0" class="text-center py-8 text-text-400">
                No content for this lesson yet.
            </Contentcontainer>

            <Contentcontainer
                v-for="topic in topics"
                :key="topic.id"
                class="space-y-2"
            >
                <h2 class="text-xl font-bold">{{ topic.title }}</h2>
                <span class="text-xs text-text-400 uppercase">{{ topic.content_type }}</span>

                <!-- Text content -->
                <div v-if="topic.content_type === 'text'" class="whitespace-pre-wrap">
                    {{ topic.content_body }}
                </div>

                <!-- Video content -->
                <div v-else-if="topic.content_type === 'video'">
                    <iframe
                        :src="topic.content_body"
                        class="w-full h-64 rounded-lg"
                        allowfullscreen
                    ></iframe>
                </div>

                <!-- Code content -->
                <div v-else-if="topic.content_type === 'code'">
                    <pre class="bg-ci-secondary-1 p-4 rounded-lg overflow-x-auto"><code>{{ topic.content_body }}</code></pre>
                </div>

                <!-- Fallback -->
                <div v-else>
                    {{ topic.content_body }}
                </div>
            </Contentcontainer>
        </template>
    </main>
</template>