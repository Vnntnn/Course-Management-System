<script setup>
import Contentcontainer from '@/assets/contentcontainer.vue';

const props = defineProps({
    number: {
        type: String,
        default: '1'
    },
    question : {
        type: String,
        default: 'Araina'
    }
});
</script>

<template>
    <Contentcontainer>
        <h1>คำถาม {{ number }}:</h1>
        <h2>{{ question }}</h2>
        <form action="" class="flex flex-col">
            <slot></slot>
        </form>
    </Contentcontainer>
</template>