<script setup>
import Button from '@/assets/button.vue'
import Progressbar from '@/assets/progressbar.vue'
import { useRouter } from 'vue-router'
import { theme } from '@/utils/theme'
import { computed } from 'vue'

const router = useRouter()

const props = defineProps({
    number: {
        type: String,
        default: '1'
    },
    title: {
        type: String,
        default: ''
    },
    count: {
        type: String,
        default: '1'
    },
    score: {
        type: String,
        default: '0'
    },
    maxscore: {
        type: String,
        default: '100'
    },
    role: {
        type: String,
        default: 'student'
    },
    examId: {
        type: [Number, String],
        default: null
    },
    courseId: {
        type: [Number, String],
        default: null
    }
})

const percent = computed(() => {
    return Math.round((parseInt(props.score) / parseInt(props.maxscore)) * 100)
})

const classes = computed(() => {
    const base = 'rounded-xl p-4 hover:ring-2'
    const themes = {
        light: 'bg-ci-secondary-4 ring-ci-secondary-1',
        dark: 'bg-ci-secondary-1 ring-ci-secondary-3'
    }
    return `${base} ${themes[theme.value] || themes.light}`
})

const goToExamDesc = () => router.push(`/course/${props.courseId}/exam/${props.examId}`)
const goToExamManage = () => router.push(`/instructor/exam/${props.examId}`)
const goToQuestionList = () => router.push(`/instructor/exam/${props.examId}/questions`)
</script>

<template>
    <div :class="classes">
        <h1 class="text-2xl font-semibold">
            {{ title || `Exam ${number}` }}
        </h1>

        <p class="text-text-400">
            Questions: {{ count }}
        </p>

        <!-- STUDENT VIEW -->
        <template v-if="role === 'student'">
            <Button @click="goToExamDesc" class="mt-2">
                Enter Exam
            </Button>
        </template>

        <!-- INSTRUCTOR VIEW -->
        <template v-if="role === 'instructor'">
            <div class="flex gap-2 mt-2">
                <Button @click="goToExamManage">
                    Manage
                </Button>
                <Button variant="primary_border" @click="goToQuestionList">
                    Questions
                </Button>
            </div>
        </template>
    </div>
</template>