<script setup>
    import { HugeiconsIcon } from '@hugeicons/vue';
    import * as icons from '@hugeicons/core-free-icons/index'
    import Button from '@/assets/button.vue';
    import { go } from '@/utils/navigation';

    const props = defineProps({
        coursename : {
            type: String,
            default: 'Course Name'
        },
        coursedesc : {
            type: String,
            default: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem reiciendis fugiat enim, doloribus sapiente, porro fugit tempora, pariatur dolorum atque veritatis.'
        },
        thumbnail : {
            Type: String,
            default: 'https://i.pinimg.com/736x/a2/31/9c/a2319c01c458e70c57ddddbc4c2244b5.jpg',
        }
    })
</script>

<template>
    <div class="bg-bg-dark-1 p-4 rounded-xl space-y-2">
        <img :src="thumbnail" alt="">
        <h1 class="text-2xl font-bold">{{ coursename }}</h1>
        <p class="text-text-300">{{ coursedesc }}</p>
        <p class="flex gap-2"><HugeiconsIcon :icon="icons.User"/>Manop EXE</p>
        <Button @click="go('/course')">Enter Course</Button>
    </div>
</template>