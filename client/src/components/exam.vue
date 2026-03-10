<script setup>
import Button from '@/assets/button.vue'
import Progressbar from '@/assets/progressbar.vue'
import { go } from '@/utils/navigation'
import { theme } from '@/utils/theme'
import { computed } from 'vue'

const props = defineProps({
  number: {
    type: String,
    default: '1'
  },
  count: {
    type: String,
    default: '1'
  },
  score: {
    type: String,
    default: '20'
  },
  maxscore: {
    type: String,
    default: '100'
  }
})

const percent = computed(() => {
  return Math.round((parseInt(props.score) / parseInt(props.maxscore)) * 100)
})

const classes = computed(() => {
  const base = 'rounded-xl p-4 hover:ring-2'

  const themes = {
    light: 'bg-ci-secondary-4 ring-ci-secondary-1',
    dark: 'bg-ci-secondary-1 ring-ci-secondary-3'
  }

  return `${base} ${themes[theme.value]}`
});
</script>

<template>
    <div :class="classes">
        <h1 class="text-2xl font-semibold">Exam {{ number }}</h1>
        <p>จำนวนข้อ: {{ count }}</p>
        <p>คะแนนที่ดีที่สุด: {{ score }}/{{ maxscore }} ({{ percent }}%)</p>
        <Progressbar :progress="percent"/>
        <Button @click="go('/examdesc')">Enter</Button>
    </div>
</template>