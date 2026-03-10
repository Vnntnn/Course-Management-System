<script setup>
import { computed } from 'vue';
import Contentcontainer from '@/assets/contentcontainer.vue';
import Button from '@/assets/button.vue';
import Progressbar from '@/assets/progressbar.vue';
import { go } from '@/utils/navigation';

const params = new URLSearchParams(window.location.search)
const score = params.get('score') || '0'
const maxscore = params.get('maxscore') || '0'
const examId = params.get('examId')

const percent = computed(() => {
    const s = parseInt(score)
    const m = parseInt(maxscore)
    if (m === 0) return 0
    return Math.round((s / m) * 100)
});
</script>

<template>
    <main class="mt-24 mx-5 flex justify-center">
        <Contentcontainer class="max-w-lg w-full text-center space-y-5 py-12">
            <h1 class="text-4xl font-bold">Exam Result</h1>

            <div class="text-6xl font-bold" :class="percent >= 50 ? 'text-green-500' : 'text-red-500'">
                {{ percent }}%
            </div>

            <p class="text-xl">
                คะแนนของคุณอยู่ที่ <span class="font-bold">{{ score }}/{{ maxscore }}</span>
            </p>

            <Progressbar :progress="String(percent)"/>

            <p class="text-text-400">
                {{ percent >= 80 ? 'ยอดเยี่ยม! 🎉' : percent >= 50 ? 'ผ่านเกณฑ์ 👍' : 'ลองทำใหม่อีกครั้ง 💪' }}
            </p>

            <div class="flex gap-3 justify-center">
                <Button @click="go('/user')">Go Back to Home</Button>
                <Button v-if="examId" variant="primary_border" @click="go(`/examdesc?examId=${examId}`)">
                    Retry
                </Button>
            </div>
        </Contentcontainer>
    </main>
</template>