<script setup>
import { computed } from 'vue';
import Contentcontainer from '@/assets/contentcontainer.vue';
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';

const props  = defineProps({
    score: String,
    maxscore: String,
});

const percent = computed(() => {
    return parseInt(props.score)/parseInt(props.maxscore);
});
</script>

<template>
    <main class="mt-24 mx-5">
        <Contentcontainer>
            <p>คะแนนของคุณอยู่ที่ {{ score }}/{{ maxscore }} ({{ percent }}% ของทั้งหมด)</p>
            <Button @click="go('/user')">Go Back to Home</Button>
        </Contentcontainer>
    </main>
</template>