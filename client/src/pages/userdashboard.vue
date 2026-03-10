<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
import { go } from '@/utils/navigation'
import contentcontainer from '@/assets/contentcontainer.vue'
import { theme } from '@/utils/theme'
import { computed, ref, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import inputtext from '@/assets/inputtext.vue'
import course_enrolled from '@/components/course_enrolled.vue'
import { useAuth } from '@/utils/auth'
import { enrollmentAPI, courseAPI } from '@/utils/api'

const { currentUser, isAuthenticated } = useAuth()

const enrolledCourses = ref([])
const instructorCourses = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

const role = computed(() => currentUser.value?.role || 'student')
const username = computed(() => currentUser.value?.full_name || 'User')
const email = computed(() => currentUser.value?.email || '')

const emailClass = computed(() => {
    return theme.value === 'dark'
        ? 'text-text-400'
        : 'text-text-500'
})

const actionLabel = computed(() => {
    return role.value === 'instructor'
        ? 'Create Course'
        : 'Browse Course'
})

const actionRoute = computed(() => {
    return role.value === 'instructor'
        ? '/coursedashboard'
        : '/coursebrowser'
})

const footerLabel = computed(() => {
    return role.value === 'instructor'
        ? 'Create New Course'
        : 'Find More Course'
})

const filteredCourses = computed(() => {
    const courses = role.value === 'instructor' ? instructorCourses.value : enrolledCourses.value
    if (!searchQuery.value) return courses
    const q = searchQuery.value.toLowerCase()
    return courses.filter(c => {
        const name = c.course?.title || c.title || ''
        return name.toLowerCase().includes(q)
    })
})

const fetchData = async () => {
    isLoading.value = true
    try {
        if (role.value === 'instructor') {
            const res = await courseAPI.getInstructorCourses()
            instructorCourses.value = res.data || []
        } else {
            const res = await enrollmentAPI.getStudentCourses()
            enrolledCourses.value = res.data || []
        }
    } catch (err) {
        console.error('Failed to fetch courses', err)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchData)
</script>

<template>

<main class="space-y-5 mt-24 mx-5">

<contentcontainer>
    <h1 class="font-bold text-3xl">
        Welcome! {{ username }}
    </h1>
    <p :class="emailClass">
        {{ email }}
    </p>
    <p class="text-text-400 text-sm mt-1">Role: {{ role }}</p>
</contentcontainer>

<section class="space-y-5">

<h1 class="font-bold text-4xl">
My Course
</h1>

<contentcontainer class="h-auto">

<div class="flex justify-center space-x-2">
    <inputtext v-model="searchQuery" input_type="text" input_placeholder="Search Course"/>
    <Button type="button" size="small_squared" variant="primary_border">
        <HugeiconsIcon :icon="icons.Search02Icon"/>
    </Button>
</div>

<!-- no courses -->

<div v-if="!isLoading && filteredCourses.length === 0" class="flex justify-center items-center flex-col gap-2 text-text-400 h-full py-8">

You haven't enrolled into any course yet.

<Button
variant="primary_border"
@click="go(actionRoute)"
class="flex gap-2">

<HugeiconsIcon :icon="icons.Search02Icon"/>

{{ actionLabel }}

</Button>

</div>

<!-- Loading -->
<div v-if="isLoading" class="flex justify-center py-8 text-text-400">
Loading courses...
</div>

<div v-if="filteredCourses.length > 0">

<div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">

<course_enrolled
v-for="item in filteredCourses"
:key="item.id"
:coursename="item.course?.title || item.title || 'Untitled'"
:instructorname="item.course?.instructor?.full_name || item.instructor?.full_name || ''"
:thumbnail="item.course?.thumbnail_url || item.thumbnail_url || 'https://i.pinimg.com/736x/a2/31/9c/a2319c01c458e70c57ddddbc4c2244b5.jpg'"
:progress="String(item.progress || '0')"
:role="role"
:courseId="item.course?.id || item.id"
/>

</div>

<div class="flex justify-center p-10">

<Button
@click="go(actionRoute)"
variant="primary_border"
class="flex gap-2">

{{ footerLabel }}

<HugeiconsIcon :icon="icons.Book02Icon"/>

</Button>

</div>

</div>

</contentcontainer>

</section>

</main>

</template>