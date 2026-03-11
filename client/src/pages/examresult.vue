<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import Progressbar from '@/assets/progressbar.vue'

const route = useRoute()
const router = useRouter()

const examId = computed(() => route.params.examId)
const score = computed(() => route.query.score || '0')
const total = computed(() => route.query.maxscore || route.query.total || '0')
const percentage = computed(() => {
    const s = parseInt(score.value)
    const t = parseInt(total.value)
    if (t === 0) return 0
    return Math.round((s / t) * 100)
})

const resultMessage = computed(() => {
    const p = percentage.value
    if (p >= 80) return { text: 'Excellent! 🎉', class: 'text-green-500' }
    if (p >= 60) return { text: 'Good job! 👍', class: 'text-blue-500' }
    if (p >= 50) return { text: 'You passed! ✓', class: 'text-yellow-500' }
    return { text: 'Keep practicing! 💪', class: 'text-red-500' }
})
</script>

<template>
    <main class="mt-24 mx-5 flex justify-center">
        <Contentcontainer class="max-w-lg w-full text-center space-y-5 py-12">
            <h1 class="text-4xl font-bold">Exam Result</h1>

            <div 
                class="text-6xl font-bold" 
                :class="percentage >= 50 ? 'text-green-500' : 'text-red-500'"
            >
                {{ percentage }}%
            </div>

            <p class="text-xl">
                Your score: <span class="font-bold">{{ score }}/{{ total }}</span>
            </p>

            <Progressbar :progress="String(percentage)"/>

            <p :class="resultMessage.class" class="text-lg font-semibold">
                {{ resultMessage.text }}
            </p>

            <div class="flex gap-3 justify-center pt-4">
                <Button @click="router.push('/dashboard')">
                    Go to Dashboard
                </Button>
                <Button 
                    v-if="examId" 
                    variant="primary_border" 
                    @click="router.push(`/exam/${examId}`)"
                >
                    Retry Exam
                </Button>
            </div>
        </Contentcontainer>
    </main>
</template>