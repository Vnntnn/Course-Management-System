<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
import Contentcontainer from '@/assets/contentcontainer.vue';
import chapter from '@/components/chapter.vue';
</script>

<template>
    <main class="mt-24 mx-5">
        <h1>Chapter</h1>
        <Contentcontainer>
            <chapter/>
            <chapter/>
            <chapter/>
        </Contentcontainer>
    </main>
</template>