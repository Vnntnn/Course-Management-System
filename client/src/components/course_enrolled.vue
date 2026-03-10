<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons'
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';
import { Type } from '@hugeicons/core-free-icons/index';
import { computed } from 'vue';
import Progressbar from '@/assets/progressbar.vue';


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
        default: '0'
    }
});


const progressBtn = computed(() => {
    let statusOfBtn = 'Start'
    if(parseInt(props.progress) == 0){
        statusOfBtn = 'Start'
    }
    else if(parseInt(props.progress) == 100){
        statusOfBtn = 'Done'
    }
    else {
        statusOfBtn = 'Continue'
    }

    return statusOfBtn;
})
</script>

<template>
    <div class="bg-ci-secondary-1 rounded-xl hover:ring-2 ring-ci-secondary-3">
        <img :src="thumbnail" alt="" class="rounded-t-xl w-full h-50 object-cover object-center">
        <div class="p-4 space-y-2">
            <h1 class="text-xl font-bold">{{ coursename }}</h1>
            <p class="flex gap-2"><HugeiconsIcon :icon="icons.User"/>{{ instructorname }}</p>
            <p class="flex gap-2">Progress:<span>{{ `${progress}%` }}</span></p>
            <Progressbar :progress="progress"/>
            <div class="flex gap-2">
                <Button @click="go('/chapterlist')">{{ progressBtn }}</Button>
                <Button @click="go('/examlist')" variant="primary_border">Exam</Button>
            </div>
        </div>
    </div>
</template>