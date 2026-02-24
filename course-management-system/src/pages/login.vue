<script setup>
import { go } from '@/utils/navigation'
</script>

<template>
    <form action="">
        <legend>Log In</legend>

        <input type="text" name="" id="username" placeholder="Username"/>
        <input type="password" name="" id="password" placeholder="Password"/>

        <button type="button">Log In</button>
        <p>Need an account? <a @click="go('/signin')">Sign Up</a></p>
    </form>
</template>