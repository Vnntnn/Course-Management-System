<script setup>
import Button from '@/assets/button.vue';
import Contentcontainer from '@/assets/contentcontainer.vue';
import Exam from '@/components/exam.vue';
import { goBack } from '@/utils/navigation';
import exam from '@/components/exam.vue';
</script>

<template>
    <main class="mt-24 mx-5">
        <Button variant="primary_border" @click="goBack()">Back To Course</Button>
        <h1>Exam List</h1>
        <Contentcontainer>
            <Exam/>
        </Contentcontainer>
    </main>
</template>