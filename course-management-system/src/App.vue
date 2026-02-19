<script setup>
import Header from "@/components/header.vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import * as icons from "@hugeicons/core-free-icons"
</script>

<template>
  <Header/>

  <main>
    <section class="h-screen flex  items-center justify-center flex-col gap-8">
      <h1 class="text-6xl font-bold">Course Management System</h1>
      <p class="text-center px-16">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores aperiam repellendus rem, illum dolorum ipsa sed sunt asperiores expedita. Dignissimos vitae minima error provident hic blanditiis modi harum! Ex, sapiente.</p>
      <div class="flex flex-col gap-2 items-center">
        <button class="px-4 py-2 w-50 h-12 items-center bg-ci-primary flex justify-between rounded-xl text-lg font-semibold hover:bg-ci-secondary-2 transition-all duration-200 text-text-100">
        Get Started
        <HugeiconsIcon
        :icon="icons.ArrowRight01Icon"
        :size="24"
        color="currentColor"
        :stroke-width="2.5"
        />
        </button>
        <p class="text-text-400">Already have an Acccount? <a href="#" class="underline">Log In</a></p>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
