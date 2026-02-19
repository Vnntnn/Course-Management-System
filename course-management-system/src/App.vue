<script setup>
import Header from "@/components/header.vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import * as icons from "@hugeicons/core-free-icons"
</script>

<template>
  <Header/>

  <main>
    <section class="h-screen flex  items-center justify-center flex-col gap-8">
      <h1 class="text-5xl font-bold">Couse Management System</h1>
      <p class="text-center px-16">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores aperiam repellendus rem, illum dolorum ipsa sed sunt asperiores expedita. Dignissimos vitae minima error provident hic blanditiis modi harum! Ex, sapiente.</p>
      <button class="px-4 py-2 bg-ci-primary flex justify-center rounded-xl">
        Get Started
        <HugeiconsIcon
        :icon="icons.ArrowRight01Icon"
        :size="24"
        color="currentColor"
        :stroke-width="1.5"
        />
      </button>
    </section>
  </main>
</template>

<style scoped></style>
