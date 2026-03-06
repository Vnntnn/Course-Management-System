<script setup>
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';

const props = defineProps({
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
    <h1>Chapter {{ chapternumber }}</h1>
    <h1>{{ chaptername }}</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum totam error cum animi quasi, voluptatibus vitae maxime a nisi voluptatem praesentium ut, iure tempore harum, repudiandae porro unde atque facere?</p>
    <Button @click="go('/details')">Enter</Button>
</template>