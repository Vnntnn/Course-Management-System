<script setup>
import { HugeiconsIcon, UserIcon } from '@/utils/icons'
const icons = { User: UserIcon }
import Button from '@/assets/button.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import Progressbar from '@/assets/progressbar.vue'
import { theme } from '@/utils/theme'

const router = useRouter()

const props = defineProps({
    coursename: {
        type: String,
        default: 'Name'
    },
    instructorname: {
        type: String,
        default: 'Instructor'
    },
    thumbnail: {
        type: String,
        default: 'https://i.pinimg.com/736x/a2/31/9c/a2319c01c458e70c57ddddbc4c2244b5.jpg'
    },
    progress: {
        type: String,
        default: '0'
    },
    role: {
        type: String,
        default: 'student'
    },
    courseId: {
        type: [Number, String],
        default: null
    }
})

const progressBtn = computed(() => {
    if (props.role === 'instructor') {
        return 'Manage'
    }

    const prog = parseInt(props.progress)
    if (prog === 0) return 'Start'
    if (prog === 100) return 'Completed'
    return 'Continue'
})

const classes = computed(() => {
    const base = 'rounded-xl hover:ring-2 transition'
    const themes = {
        light: 'bg-ci-secondary-4 ring-ci-secondary-1',
        dark: 'bg-ci-secondary-1 ring-ci-secondary-3'
    }
    return `${base} ${themes[theme.value] || themes.light}`
})

const goToChapters = () => router.push(`/course/${props.courseId}/chapters`)
const goToExams = () => router.push(`/course/${props.courseId}/exams`)
const goToManage = () => router.push(`/instructor/course/${props.courseId}/edit`)
const goToCourseOverview = () => router.push(`/course/${props.courseId}`)
</script>

<template>
    <div :class="classes" class="cursor-pointer" @click="goToCourseOverview">
        <img
            :src="thumbnail"
            class="rounded-t-xl w-full h-52 object-cover object-center"
        />

        <div class="p-4 space-y-2">
            <h1 class="text-xl font-bold">{{ coursename }}</h1>

            <p class="flex gap-2">
                <HugeiconsIcon :icon="icons.User" />
                {{ instructorname }}
            </p>

            <!-- STUDENT ONLY -->
            <template v-if="role === 'student'">
                <p class="flex gap-2">
                    Progress: <span>{{ `${progress}%` }}</span>
                </p>

                <Progressbar :progress="progress" />

                <div class="flex gap-2">
                    <Button @click.stop="goToChapters">
                        {{ progressBtn }}
                    </Button>
                    <Button @click.stop="goToExams" variant="primary_border">
                        Exam
                    </Button>
                </div>
            </template>

            <!-- INSTRUCTOR ONLY -->
            <template v-if="role === 'instructor'">
                <div class="flex gap-2">
                    <Button @click.stop="goToManage">
                        Manage
                    </Button>
                    <Button @click.stop="goToChapters" variant="primary_border">
                        Chapter
                    </Button>
                    <Button @click.stop="goToExams" variant="primary_border">
                        Exam
                    </Button>
                </div>
            </template>
        </div>
    </div>
</template>