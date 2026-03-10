<script setup>
import Button from '@/assets/button.vue'
import { go } from '@/utils/navigation'
import { theme } from '@/utils/theme'
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
})

const classes = computed(() => {
  const base = 'rounded-xl p-4 hover:ring-2'

  const themes = {
    light: 'bg-ci-secondary-4 ring-ci-secondary-1',
    dark: 'bg-ci-secondary-1 ring-ci-secondary-3'
  }

  return `${base} ${themes[theme.value] || themes.light}`
})
</script>

<template>

<div :class="classes">

<h1 class="text-2xl font-semibold mt-2">
Chapter {{ chapternumber }} - {{ chaptername }}
</h1>

<p class="p-3 text-text-400">
Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum totam error cum animi quasi.
</p>

<Button @click="go('/chapteredit')">
Manage
</Button>

</div>

</template>