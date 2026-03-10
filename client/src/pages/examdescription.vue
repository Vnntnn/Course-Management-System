<script setup>

import Contentcontainer from '@/assets/contentcontainer.vue';
import Button from '@/assets/button.vue';
import { goBack } from '@/utils/navigation';

const props = defineProps({
    number : {
        Type: String,
        default: '1'
    },

    questionamount: {
        Type: String,
        default: '1'
    }
})


</script>

<template>
    <main class="mt-24 mx-5">
        <Button variant="primary_border" @click="goBack()">Back to Exam List</Button>
        <Contentcontainer class="flex justify-center items-center flex-col h-auto p-20">
            <h1 class="text-4xl">Exam No: {{ number }}</h1>
            <p>จำนวนข้อ: {{ questionamount }}</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas praesentium nemo eum veniam error accusamus, obcaecati, amet sed consequatur rerum, porro minima. Consectetur sunt vel dolorem omnis nihil, quibusdam ea!</p>
            <Button class="m-5">Start Exam</Button>
        </Contentcontainer>
    </main>
</template>