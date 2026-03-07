<script setup>
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';

const props = defineProps({
        thumbnail : {
            type: String,
            default: '#'
        },
        chapternumber : {
            type: String,
            default: '1'
        },
        chaptername : {
            type: String,
            default: 'Hello World'
        }
    })
</script>

<template>
    <div class="bg-bg-dark-1 p-5 rounded-xl">
        <img :src="thumbnail" alt="">
        <h1 class="text-2xl">Chapter {{ chapternumber }} - {{ chaptername }}</h1>
        <p class="p-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum totam error cum animi quasi, voluptatibus vitae maxime a nisi voluptatem praesentium ut, iure tempore harum, repudiandae porro unde atque facere?</p>
        <Button @click="go('/details')">Enter</Button>
    </div>
</template>