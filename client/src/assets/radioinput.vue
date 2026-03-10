<script setup>
import { computed } from 'vue';
const props = defineProps({
    label: String,
    name: String,
    checked: Boolean
});

const classes = computed(() => {
    let variant = 'py-2 px-4';
    const base = "flex gap-2 items-center"
    if(props.checked == true){
        variant = 'bg-ci-secondary-3 text-ci-secondary-2'
    }

    return `${base} ${variant}`
});
</script>

<template>
    <div :class="classes">
        <input type="radio" :name="name" :value="value" :checked="checked"/>
        <label :for="value">{{label}}</label>
    </div>
</template>