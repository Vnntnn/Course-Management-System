<script setup>

import { computed } from 'vue'
import { theme } from '@/utils/theme'

const classes = computed(() => {

    const base = 'rounded-xl p-4'

    const themes = {
        light: 'bg-bg-light-2',
        dark: 'bg-bg-dark-2'
    }

    return `${base} ${themes[theme.value]}`

})

</script>

<template>

<section :class="classes">
    <slot/>
</section>

</template>