<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons/index'
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';
</script>

<template>
    <main class="mt-24 px-5">
        <Button> <!-- Haven't enrolled yet -->
            <HugeiconsIcon :icon="icons.Book"/>
            Enroll
        </Button>
        <Button @click="go('/chapterlist')"> <!-- Have Enrolled -->
            <HugeiconsIcon :icon="icons.Book"/>
            Chapter
        </Button>
        <h1>Course Name</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis doloremque facere fugit ullam quibusdam reprehenderit, molestias suscipit impedit enim consectetur vitae voluptate est consequatur quam, quidem praesentium minima sapiente porro?</p>
    </main>
</template>