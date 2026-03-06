<script setup>
import Header from "@/components/header.vue";
import { themeClasses } from '@/utils/theme'
</script>

<template>

<div :class="themeClasses" class="min-h-screen flex flex-col">

  <Header />

  <main class="">
    <router-view />
  </main>

</div>

</template>