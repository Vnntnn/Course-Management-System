<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
import { go } from '@/utils/navigation'
import contentcontainer from '@/assets/contentcontainer.vue'
import { theme } from '@/utils/theme'
import { computed } from 'vue'
import Button from '@/assets/button.vue'
import inputtext from '@/assets/inputtext.vue'
import course_enrolled from '@/components/course_enrolled.vue'

const props = defineProps({
    username : {
        type: String,
        default: 'Mstxz.EXE'
    },
    email : {
        type : String,
        default: 'mstxzexe@gmail.com'
    },
    role : {
        type : String,
        default : 'student' // student | instructor
    }
})

const emailClass = computed(() => {
    return theme.value === 'dark'
        ? 'text-text-400'
        : 'text-text-500'
})

const actionLabel = computed(() => {
    return props.role === 'instructor'
        ? 'Create Course'
        : 'Browse Course'
})

const actionRoute = computed(() => {
    return props.role === 'instructor'
        ? '/coursecreate'
        : '/coursebrowser'
})

const footerLabel = computed(() => {
    return props.role === 'instructor'
        ? 'Create New Course'
        : 'Find More Course'
})
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
</contentcontainer>

<section class="space-y-5">

<h1 class="font-bold text-4xl">
My Course
</h1>

<contentcontainer class="h-auto">

<div class="flex justify-center space-x-2">
    <inputtext input_type="text" input_placeholder="Search Course"/>
    <Button type="button" size="small_squared" variant="primary_border">
        <HugeiconsIcon :icon="icons.Search02Icon"/>
    </Button>
</div>

<!-- no courses -->

<div class="hidden justify-center items-center flex-col gap-2 text-text-400 h-full">

You haven't enrolled into any course yet.

<Button
variant="primary_border"
@click="go(actionRoute)"
class="flex gap-2">

<HugeiconsIcon :icon="icons.Search02Icon"/>

{{ actionLabel }}

</Button>

</div>

<div>

<div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">

<course_enrolled
coursename="Blender 3D Basics"
instructorname="Mstxz"
progress="100"
/>

<course_enrolled progress="20"/>
<course_enrolled/>
<course_enrolled/>

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