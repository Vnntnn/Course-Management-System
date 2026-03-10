<script setup>
<<<<<<< HEAD
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/assets/button.vue';
import Inputtext from '@/assets/inputtext.vue';
import { go } from '@/utils/navigation'
import { useAuth } from '@/utils/auth';
import * as icons from '@hugeicons/core-free-icons/index';
import { HugeiconsIcon } from '@hugeicons/vue';

const router = useRouter();
const { login, isLoading, error } = useAuth();

const email = ref('');
const password = ref('');
const formError = ref('');

const handleLogin = async () => {
  formError.value = '';
  if (!email.value || !password.value) {
    formError.value = 'Please fill in all fields';
    return;
  }

  try {
    await login(email.value, password.value);
    router.push('/user');
  } catch (err) {
    formError.value = error.value || 'Login failed. Please try again.';
  }
};
=======
import Button from '@/assets/button.vue';
import Inputtext from '@/assets/inputtext.vue';
import { go, goBack } from '@/utils/navigation'
import * as icons from '@hugeicons/core-free-icons/index';
import { HugeiconsIcon } from '@hugeicons/vue';
>>>>>>> frontend
</script>

<template>
    <main class="h-screen flex justify-center items-center flex-col">
<<<<<<< HEAD
        <Button variant="primary_border" class="fixed top-24 left-4 flex gap-2" @click="go('/')">
            <HugeiconsIcon :icon="icons.Home03Icon"/>
            Back to homepage
        </Button>
        <form @submit.prevent="handleLogin" class="flex flex-col p-8 gap-5 w-96">
            <legend class="font-bold text-3xl text-center">Log In</legend>

            <Inputtext v-model="email" input_type="email" input_placeholder="Email"/>
            <Inputtext v-model="password" input_type="password" input_placeholder="Password"/>

            <div v-if="formError" class="text-red-500 text-sm text-center">{{ formError }}</div>

            <Button type="submit" :disabled="isLoading" class="w-full items-center justify-center flex">
              {{ isLoading ? 'Logging in...' : 'Log In' }}
            </Button>
=======
        <Button variant="primary_border" class="fixed top-24 left-4 flex gap-2" @click="goBack()">
            <HugeiconsIcon :icon="icons.Home03Icon"/>
            Back to homepage
        </Button>
        <form class="flex flex-col p-8 gap-5 w-96">
        <legend class="font-bold text-3xl text-center">Log In</legend>

            <Inputtext input_type="email" input_placeholder="Email"/>
            <Inputtext input_type="password" input_placeholder="Password"/>

            <Button type="button" class="w-full items-center justify-center flex" @click="go('/user')">Create Account</Button>
>>>>>>> frontend
        </form>
        <p>Need an account? <a @click="go('/signup')" class="underline cursor-pointer font-bold">Sign Up</a></p>
    </main>
</template>