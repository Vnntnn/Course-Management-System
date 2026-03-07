<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons';
import smallbutton from '@/assets/button.vue';
import { computed } from 'vue';

import { go } from '@/utils/navigation';
import { theme, toggleTheme } from '@/utils/theme'

const classes = computed(() => {
    const base = "flex fixed w-screen justify-between px-8 py-4 items-center shadow-lg z-10"

    const themes = {
        light: 'bg-bg-light-1',
        dark: 'bg-bg-dark-1'
    }

    return `${base} ${themes[theme.value]}`
});

</script>

<template>
    <header :class="classes">
        <h1 class="text-xl font-bold hover:cursor-pointer" @click="go('/')">Course<span class="text-ci-primary uppercase">wind</span></h1>
        <div class="flex gap-4 items-center">
            <div class="flex gap-4"> <!-- No Account -->
                <smallbutton @click="go('/signup')">Sign Up</smallbutton>
                <smallbutton variant="primary_border" @click="go('/login')">Log In</smallbutton>
            </div>
            <div> <!-- Has Account -->
                <smallbutton variant="primary_border" size="small_squared" @click="go('/user')"><HugeiconsIcon :icon="icons.UserIcon"/></smallbutton>
            </div>
            <smallbutton variant="primary_border" @click="toggleTheme()">
                <HugeiconsIcon :icon="icons.Moon02Icon" :size="24" color="currentColor"/>
            </smallbutton>
        </div>
    </header>
</template>