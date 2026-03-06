<script setup>
import Button from '@/assets/button.vue';
import Contentcontainer from '@/assets/contentcontainer.vue';
import { go } from '@/utils/navigation';

</script>

<template>
    <main class="mt-24">
        <Button @click="go('/chapterlist')">Go Back</Button>
        <h1>Chapter Name</h1>
        <Contentcontainer>
            <!-- Add anything here -->
        </Contentcontainer>
    </main>
</template>