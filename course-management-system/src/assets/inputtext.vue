<script setup>
import { computed } from 'vue';

const props = defineProps({
    input_type : {
        type : String,
        default : 'text'
    },

    input_placeholder : {
        type : String,
        default : ''
    },

    variant : {

    }
});

const inputtype = computed(() => {

})
</script>

<template>
    <input :type="input_type" :placeholder="input_placeholder" class="font-semibold text-text-400 px-2 py-1 border rounded"/>
</template>