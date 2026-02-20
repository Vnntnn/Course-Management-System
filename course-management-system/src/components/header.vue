<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import { Moon02Icon } from '@hugeicons/core-free-icons';
import smallbutton from '@/assets/button.vue'
let i = 0;
let theme = ["text-primary bg-bg-light-1 text-text-900","text-primary bg-bg-dark-1 text-text-100"];
function changeTheme(){
    i++;
    document.body.classList = theme[i%2];
}

changeTheme();
</script>

<template>
    <header class="flex fixed w-screen justify-between px-8 py-4 items-center shadow-lg">
        <h1 class="text-xl font-bold">CMS</h1>
        <div class="flex gap-4 items-center">
            <smallbutton>Sign In</smallbutton>
            <smallbutton variant="primary_border">Log In</smallbutton>
            <smallbutton variant="primary_border" @click="changeTheme">
                <HugeiconsIcon :icon="Moon02Icon" :size="24" color="currentColor"/>
            </smallbutton>
        </div>
    </header>
</template>