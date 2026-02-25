<script setup>
import Header from "@/components/header.vue";
import { themeClasses } from '@/utils/theme'
</script>

<template>

<div :class="themeClasses" class="min-h-screen flex flex-col">

  <Header />

  <main class="flex-1 mt-24 mx-5">
    <router-view />
  </main>

</div>

</template>