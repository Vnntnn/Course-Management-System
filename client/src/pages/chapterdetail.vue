<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import { courseAPI, userAPI, enrollmentAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const courseId = computed(() => route.params.courseId)
const lessonId = computed(() => route.params.lessonId)

const { currentUser } = useAuth()
const isStudent = computed(() => currentUser.value?.role === 'student')
const role = computed(() => currentUser.value?.role || 'student')

const lesson = ref(null)
const topics = ref([])
const isLoading = ref(false)
const error = ref('')

// Track completed topics during this session
const completedTopics = ref(new Set())

const checkAccess = async () => {
    if (role.value === 'instructor') {
        isEnrolled.value = true
        enrollChecked.value = true
        return
    }
    if (!courseId.value) return
    try {
        const res = await enrollmentAPI.checkEnrollment(courseId.value)
        isEnrolled.value = res.data?.enrolled === true
    } catch {
        isEnrolled.value = false
    }
    enrollChecked.value = true
}

const fetchLesson = async () => {
    if (!courseId.value || !lessonId.value) return
    isLoading.value = true
    error.value = ''
    // Reset completed topics on fresh fetch
    completedTopics.value = new Set()
    
    try {
        const courseRes = await courseAPI.getById(courseId.value, true)
        const course = courseRes.data
        const found = course?.lessons?.find(l => l.id === parseInt(lessonId.value))
        if (found) {
            lesson.value = found
            topics.value = found.topics || []
        } else {
            error.value = 'Lesson not found'
        }
        
        // Fetch completed topics (for students)
        try {
            const progressRes = await userAPI.getCompletedTopics(courseId.value)
            if (progressRes.data && Array.isArray(progressRes.data)) {
                progressRes.data.forEach(id => completedTopics.value.add(id))
            }
        } catch {
            // Ignore if not a student or not authenticated
        }
    } catch (err) {
        error.value = err.message || 'Failed to load lesson'
    } finally {
        isLoading.value = false
    }
}

const markComplete = async (topicId) => {
    if (!courseId.value || !topicId) return
    
    try {
        await userAPI.updateProgress({
            topic_id: topicId,
            course_id: parseInt(courseId.value)
        })
        completedTopics.value.add(topicId)
    } catch (err) {
        console.error('Failed to update progress', err)
        alert('Failed to save progress. Please try again.')
    }
}

const goBack = () => router.push(`/course/${courseId.value}/chapters`)

onMounted(fetchLesson)
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">
            ← Back to Lessons
        </Button>

        <div v-if="isLoading" class="text-text-400 text-center py-8">Loading...</div>
        <div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

            <template v-if="lesson">
                <h1 class="text-4xl font-bold">{{ lesson.title }}</h1>

                <Contentcontainer v-if="topics.length === 0" class="text-center py-8 text-text-400">
                    No content for this lesson yet.
                </Contentcontainer>

            <Contentcontainer
                v-for="(topic, index) in topics"
                :key="topic.id"
                class="space-y-4"
            >
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-xl font-bold">{{ index + 1 }}. {{ topic.title }}</h2>
                        <span class="text-xs text-text-400 uppercase">{{ topic.content_type }}</span>
                    </div>
                </div>

                <!-- Text content -->
                <div v-if="topic.content_type === 'text'" class="whitespace-pre-wrap leading-relaxed">
                    {{ topic.content_body }}
                </div>

                <!-- Video content -->
                <div v-else-if="topic.content_type === 'video'">
                    <iframe
                        :src="topic.content_body"
                        class="w-full h-64 md:h-96 rounded-lg"
                        allowfullscreen
                    ></iframe>
                </div>

                    <div v-else-if="topic.content_type === 'code'">
                        <pre class="bg-ci-secondary-1 p-4 rounded-lg overflow-x-auto"><code>{{ topic.content_body }}</code></pre>
                    </div>

                <!-- Fallback -->
                <div v-else class="whitespace-pre-wrap">
                    {{ topic.content_body }}
                </div>
                
                <!-- Progress Tracking Button (Students Only) -->
                <div v-if="isStudent" class="pt-4 border-t border-ci-secondary-2/50 flex justify-end">
                    <Button 
                        v-if="!completedTopics.has(topic.id)"
                        @click="markComplete(topic.id)"
                    >
                        Mark as Complete
                    </Button>
                    <div v-else class="text-green-500 font-semibold flex items-center gap-2">
                        ✓ Completed
                    </div>
                </div>
            </Contentcontainer>

            <!-- Navigation -->
            <div class="flex gap-3 pt-4">
                <Button variant="primary_border" @click="router.push(`/course/${courseId}/chapters`)">
                    Back to All Lessons
                </Button>
                <Button variant="primary_border" @click="router.push(`/course/${courseId}/exams`)">
                    View Exams
                </Button>
            </div>
        </template>
    </main>
</template>