<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from '@/assets/button.vue';
import Contentcontainer from '@/assets/contentcontainer.vue';
import { go, goBack } from '@/utils/navigation';
import { courseAPI, userAPI, enrollmentAPI } from '@/utils/api'
import { useAuth } from '@/utils/auth'

const params = new URLSearchParams(window.location.search)
const courseId = params.get('courseId')
const lessonId = params.get('lessonId')

const { currentUser } = useAuth()
const isStudent = computed(() => currentUser.value?.role === 'student')
const role = computed(() => currentUser.value?.role || 'student')

const lesson = ref(null)
const topics = ref([])
const isLoading = ref(false)
const error = ref('')
const isEnrolled = ref(false)
const enrollChecked = ref(false)
const completedTopics = ref(new Set())

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

const markComplete = async (topicId) => {
    if (!courseId || !topicId) return
    try {
        await userAPI.updateProgress({
            topic_id: topicId,
            course_id: parseInt(courseId)
        })
        completedTopics.value.add(topicId)
    } catch (err) {
        console.error('Failed to update progress', err)
        alert('Failed to save progress. Please try again.')
    }
}

onMounted(async () => {
    await checkAccess()
    if (isEnrolled.value) {
        await fetchLesson()
    }
})
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Button variant="primary_border" @click="goBack()">← Go Back</Button>

        <!-- Not enrolled guard -->
        <Contentcontainer v-if="enrollChecked && !isEnrolled" class="text-center py-12 space-y-4">
            <h2 class="text-2xl font-bold">🔒 Enrollment Required</h2>
            <p class="text-text-400">You must enroll in this course before viewing lesson content.</p>
            <Button @click="go(`/course?courseId=${courseId}`)">
                Go to Course Page to Enroll
            </Button>
        </Contentcontainer>

        <template v-if="isEnrolled">
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
                    class="space-y-4"
                >
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-xl font-bold">{{ topic.title }}</h2>
                            <span class="text-xs text-text-400 uppercase">{{ topic.content_type }}</span>
                        </div>
                    </div>

                    <div v-if="topic.content_type === 'text'" class="whitespace-pre-wrap">
                        {{ topic.content_body }}
                    </div>

                    <div v-else-if="topic.content_type === 'video'">
                        <iframe
                            :src="topic.content_body"
                            class="w-full h-64 rounded-lg"
                            allowfullscreen
                        ></iframe>
                    </div>

                    <div v-else-if="topic.content_type === 'code'">
                        <pre class="bg-ci-secondary-1 p-4 rounded-lg overflow-x-auto"><code>{{ topic.content_body }}</code></pre>
                    </div>

                    <div v-else>
                        {{ topic.content_body }}
                    </div>

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
            </template>
        </template>
    </main>
</template>