<script setup>
const props = defineProps({
        progress : {
        Type: String,
        default: '0'
    }
})
</script>

<template>
    <div id="progressbar" class="bg-gray-400 w-full h-3 rounded-full">
        <div class="bg-linear-to-r from-link to-link-light h-full rounded-full" :style="{ width: `${progress}%` }"></div>
    </div>
</template>