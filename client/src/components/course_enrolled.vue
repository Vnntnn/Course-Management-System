<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons'
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';
import { Type } from '@hugeicons/core-free-icons/index';


const props = defineProps({
    coursename : {
        Type: String,
        default: 'Name'
    },
    instructorname : {
        Type: String,
        default: 'Manop EXE'
    },
    thumbnail : {
        Type: String,
        default : 'https://i.pinimg.com/736x/a2/31/9c/a2319c01c458e70c57ddddbc4c2244b5.jpg'
    },
    progress : {
        Type: String,
        default: '30%'
    }
});
</script>

<template>
    <div class="bg-bg-dark-1 p-4 rounded-xl space-y-2">
        <img :src="thumbnail" alt="">
        <h1 class="text-xl font-bold">{{ coursename }}</h1>
        <p class="flex gap-2"><HugeiconsIcon :icon="icons.User"/>{{ instructorname }}</p>
        <p>Progress:<span>{{ progress }}</span></p>
        <div id="progressbar" class="bg-gray-400 w-50 h-2 rounded-full">
            <div class="bg-linear-to-r from-link to-link-light h-full rounded-full" :style="{ width: progress }"></div>
        </div>
        <Button @click="go('/chapterlist')">Continue</Button>
    </div>
</template>