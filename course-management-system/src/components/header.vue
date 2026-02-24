<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import { Moon02Icon } from '@hugeicons/core-free-icons';
import smallbutton from '@/assets/button.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { go } from '@/utils/navigation';

const props = defineProps({
    theme: {
        Type: String,
        default: 'light'
    }
});

const classes = computed(() => {
    const base = "flex fixed w-screen justify-between px-8 py-4 items-center shadow-lg"

    const theme = {
        light: "bg-bg-light-1 text-text-900",
        dark: "bg-bg-dark-1 text-text-100"
    }

    return `${base} ${theme[props.theme]}`
});

</script>

<template>
    <header :class="classes">
        <h1 class="text-xl font-bold" @click="go('/')">CMS</h1>
        <div class="flex gap-4 items-center">
            <smallbutton @click="go('/signin')">Sign In</smallbutton>
            <smallbutton variant="primary_border" @click="go('/login')">Log In</smallbutton>
            <smallbutton variant="primary_border">
                <HugeiconsIcon :icon="Moon02Icon" :size="24" color="currentColor"/>
            </smallbutton>
        </div>
    </header>
</template>