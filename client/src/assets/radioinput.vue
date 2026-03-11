<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: String,
    name: String,
    value: [String, Number],
    modelValue: [String, Number],
    checked: Boolean
});

const emit = defineEmits(['update:modelValue']);

const isChecked = computed(() => {
    if (props.modelValue !== undefined) {
        return props.modelValue === props.value;
    }
    return props.checked;
});

const classes = computed(() => {
    const base = "flex gap-2 items-center py-2 px-4 cursor-pointer";
    if (isChecked.value) {
        return `${base} bg-ci-secondary-3 text-ci-secondary-2`;
    }
    return base;
});

function handleChange() {
    emit('update:modelValue', props.value);
}
</script>

<template>
    <label :class="classes">
        <input 
            type="radio" 
            :name="name" 
            :value="value" 
            :checked="isChecked"
            @click.stop="handleChange"
            class="accent-ci-secondary-2"
        />
        <span v-if="label">{{ label }}</span>
    </label>
</template>