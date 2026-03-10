<script setup>
    import { HugeiconsIcon } from '@hugeicons/vue';
    import * as icons from '@hugeicons/core-free-icons/index'
    import Button from '@/assets/button.vue';
    import { go } from '@/utils/navigation';
    import { theme } from '@/utils/theme';
import { computed } from 'vue';

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
    });

    const classes = computed(() => {
        const base = "rounded-xl flex flex-col hover:ring-2"

        const themes = {
            light: 'bg-ci-secondary-4 ring-ci-secondary-1',
            dark: 'bg-ci-secondary-1 ring-ci-secondary-3'
        }

        return `${base} ${themes[theme.value]}`
    });
</script>

<template>

    <div :class="classes">
    <img :src="thumbnail" class="rounded-t-xl w-full h-50 object-cover">

    <div class="p-4 flex flex-col flex-1">
        <h1 class="text-2xl font-bold">{{ coursename }}</h1>
        <p class="text-text-300">{{ coursedesc }}</p>
        <p class="flex gap-2"><HugeiconsIcon :icon="icons.User"/>Manop EXE</p>

        <Button @click="go('/course')" class="mt-auto">
            Enter Course
        </Button>
    </div>
</div>

</template>