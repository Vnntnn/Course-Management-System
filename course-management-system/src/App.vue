<script setup>
import Header from "@/components/header.vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import * as icons from "@hugeicons/core-free-icons";
import buttons from '@/assets/button.vue'
</script>

<template>
  <Header/>

  <main class="[&>section]:h-screen">
    <section class="flex items-center justify-center flex-col gap-8">
      <h1 class="text-6xl font-bold">Course Management System</h1>
      <p class="text-center px-16">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores aperiam repellendus rem, illum dolorum ipsa sed sunt asperiores expedita. Dignissimos vitae minima error provident hic blanditiis modi harum! Ex, sapiente.</p>
      <div class="flex flex-col gap-2 items-center">
        <buttons size="large">
          Get Started
          <HugeiconsIcon :icon="icons.ArrowRight01Icon" :size="24" color="currentColor" :stroke-width="2.5"/>
        </buttons>
        <p class="text-text-400">Already have an Acccount? <a href="#" class="underline">Log In</a></p>
      </div>
    </section>

    <section></section>
  </main>
</template>

<style scoped></style>
