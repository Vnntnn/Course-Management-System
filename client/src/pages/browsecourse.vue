<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { HugeiconsIcon } from "@hugeicons/vue"
import * as icons from "@hugeicons/core-free-icons"
import Button from '@/assets/button.vue'
import Inputtext from "@/assets/inputtext.vue"
import Contentcontainer from "@/assets/contentcontainer.vue"
import Course from "@/components/course.vue"
import { courseAPI } from '@/utils/api'

const router = useRouter()
const courses = ref([])
const isLoading = ref(false)
const error = ref('')
const searchQuery = ref('')

const filteredCourses = computed(() => {
    if (!searchQuery.value) return courses.value
    const q = searchQuery.value.toLowerCase()
    return courses.value.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description?.toLowerCase().includes(q) ||
        c.instructor?.full_name?.toLowerCase().includes(q)
    )
})

const fetchCourses = async () => {
    isLoading.value = true
    error.value = ''
    try {
        const res = await courseAPI.getAll()
        courses.value = res.data || []
    } catch (err) {
        error.value = err.message || 'Failed to fetch courses'
        console.error('Failed to fetch courses', err)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchCourses)
</script>

<template>
    <main class="mt-24">
        <h1 class="font-bold text-2xl mx-5">Browse Courses</h1>
        <Contentcontainer class="mx-5 space-y-4">
            <div class="flex items-center gap-4">
                <Inputtext 
                    v-model="searchQuery" 
                    input_type="text" 
                    input_placeholder="Search courses..."
                />
                <Button variant="primary_border" size="small_squared" class="flex gap-2">
                    <HugeiconsIcon :icon="icons.Search02Icon"/>
                    Search
                </Button>
            </div>

            <div v-if="isLoading" class="text-center text-text-400 py-8">
                Loading courses...
            </div>

            <div v-if="error" class="text-center text-red-500 py-4">
                {{ error }}
            </div>

            <div v-if="!isLoading && filteredCourses.length === 0" class="text-center text-text-400 py-8">
                No courses found.
            </div>

            <div id="courselist" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Course
                    v-for="c in filteredCourses"
                    :key="c.id"
                    :coursename="c.title"
                    :coursedesc="c.description"
                    :thumbnail="c.thumbnail_url || 'https://i.pinimg.com/736x/a2/31/9c/a2319c01c458e70c57ddddbc4c2244b5.jpg'"
                    :instructorname="c.instructor?.full_name || 'Instructor'"
                    :courseId="c.id"
                />
            </div>
        </Contentcontainer>
    </main>
</template>