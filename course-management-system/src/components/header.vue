<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import { Moon02Icon } from '@hugeicons/core-free-icons';
import smallbutton from '@/assets/button.vue';
import { Type } from '@hugeicons/core-free-icons/index';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    theme: {
        Type: String,
        default: 'light'
    }
});

const classes = computed(() => {
    const base = "flex fixed w-screen justify-between px-8 py-4 items-center shadow-lg"

    const theme = {
        light: "bg-bg-white-1 text-text-900",
        dark: "bg-bg-dark-1 text-text-100"
    }

    return `${base} ${theme[props.theme]}`
});

const router = useRouter();

function goLogin(){
    router.push('/login');
}

function goSignup() {
  router.push('/signin')
}

</script>

<template>
    <header :class="classes">
        <h1 class="text-xl font-bold">CMS</h1>
        <div class="flex gap-4 items-center">
            <smallbutton @click="goSignup">Sign In</smallbutton>
            <smallbutton variant="primary_border" @click="goLogin">Log In</smallbutton>
            <smallbutton variant="primary_border">
                <HugeiconsIcon :icon="Moon02Icon" :size="24" color="currentColor"/>
            </smallbutton>
        </div>
    </header>
</template>