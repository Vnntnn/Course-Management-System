<script setup>
import { HugeiconsIcon } from "@hugeicons/vue";
import * as icons from "@hugeicons/core-free-icons";
import buttons from '@/assets/button.vue'
import { go } from '@/utils/navigation'

</script>

<template>

  <main class="[&>section]:h-screen">
    <section class="flex items-baseline justify-center flex-col gap-8 pl-16">
      <h1 class="text-6xl font-bold">Course<span class="uppercase text-ci-primary">wind</span></h1>
      <p class="w-1/2 sm:w-1/2 md:w-3/4 lg:w-1/2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit amet dolorem inventore tenetur! Accusamus qui, officia animi omnis voluptatem quas nobis, rem sunt quod voluptates, quia ipsum unde corrupti vitae!
      </p>
      <div class="flex flex-col gap-2">
        <buttons size="large_rect" @click="go('/signup')" class="flex justify-between">
          Get Started
          <HugeiconsIcon
            :icon="icons.ArrowRightDoubleIcon"
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
</template>