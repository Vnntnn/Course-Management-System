<script setup>
import Header from "@/components/header.vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import * as icons from "@hugeicons/core-free-icons";
import buttons from '@/assets/button.vue'
import { computed } from "vue";
import { go } from '@/utils/navigation'

const props = defineProps({
  theme: {
    type: String,
    default: "dark"
  }
});

const classes = computed(() => {
  const theme = {
    light: "bg-bg-white-1 text-text-900",
    dark: "bg-bg-dark-1 text-text-100"
  }
  return theme[props.theme];
});

</script>

<template>
<div :class="props.theme === 'light' ? 'dark' : ''">
  <Header :theme="classes"/>

  <main class="[&>section]:h-screen">
    <section class="flex items-center justify-center flex-col gap-8">
      <h1 class="text-6xl font-bold">Course Management System</h1>
      <p class="text-center px-16">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit amet dolorem inventore tenetur! Accusamus qui, officia animi omnis voluptatem quas nobis, rem sunt quod voluptates, quia ipsum unde corrupti vitae!
      </p>
      <div class="flex flex-col gap-2 items-center">
        <buttons size="large" @click="go('/signin')">
          Get Started
          <HugeiconsIcon
            :icon="icons.ArrowRight01Icon"
            :size="24"
            color="currentColor"
            :stroke-width="2.5"
          />
        </buttons>
        <p class="text-text-400">Already have an Acccount?<a href="#" class="underline" @click="go('/login')">Log In</a></p>
      </div>
    </section>
    <section>

    </section>
  </main>
</div>

</template>