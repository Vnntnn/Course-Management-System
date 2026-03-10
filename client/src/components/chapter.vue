<script setup>
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';
import { theme } from '@/utils/theme';
import { computed } from 'vue'

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
});

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
        <img :src="thumbnail" alt="">
        <h1 class="text-2xl">Chapter {{ chapternumber }} - {{ chaptername }}</h1>
        <p class="p-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum totam error cum animi quasi, voluptatibus vitae maxime a nisi voluptatem praesentium ut, iure tempore harum, repudiandae porro unde atque facere?</p>
        <Button @click="go('/details')">Enter</Button>
    </div>
</template>