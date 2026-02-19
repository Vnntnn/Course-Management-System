<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import { Moon02Icon } from '@hugeicons/core-free-icons';

function changeTheme(){
    document.body.classList = "bg-bg-dark-1 text-text-100"
}
</script>

<template>
    <header class="flex fixed w-screen justify-between px-8 py-4 items-center shadow-lg">
        <h1 class="text-xl font-bold">CMS</h1>
        <div class="flex gap-4 items-center">
            <button class=" px-4 py-2 rounded-xl w-25 bg-ci-primary text-text-100">Log in</button>
            <button class="border border-slate-400 px-4 py-2 rounded-xl w-25">Sign in</button>
            <button v-on:click="changeTheme()" class="border border-slate-400 p-2 rounded-xl">
                <HugeiconsIcon
                :icon="Moon02Icon"
                :size="24"
                color="currentColor"
                :stroke-width="1.5"
                />
            </button>
        </div>
    </header>
</template>