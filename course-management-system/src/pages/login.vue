<script setup>
import Button from '@/assets/button.vue';
import Inputtext from '@/assets/inputtext.vue';
import { go } from '@/utils/navigation'
import * as icons from '@hugeicons/core-free-icons/index';
import { HugeiconsIcon } from '@hugeicons/vue';
</script>

<template>
    <main class="h-screen flex justify-center items-center flex-col">
        <Button variant="primary_border" class="fixed top-24 left-4 flex gap-2" @click="go('/')">
            <HugeiconsIcon :icon="icons.Home03Icon"/>
            Back to homepage
        </Button>
        <form class="flex flex-col p-8 gap-5 w-96">
        <legend class="font-bold text-3xl text-center">Log In</legend>

            <Inputtext input_type="email" input_placeholder="Email"/>
            <Inputtext input_type="password" input_placeholder="Password"/>

            <Button type="button">Log In</Button>
        </form>
        <p>Need an account? <a @click="go('/signup')" class="underline cursor-pointer font-bold">Sign Up</a></p>
    </main>
</template>