<script setup>
import { ref, computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    input_type: {
        type: String,
        default: 'text'
    },
    input_placeholder: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)

const inputtype = computed(() =>
    props.input_type === 'password'
        ? (showPassword.value ? 'text' : 'password')
        : props.input_type
)

const handleInput = (event) => {
    emit('update:modelValue', event.target.value)
}
</script>

<template>

<div class="relative w-full">

    <input
        :type="inputtype"
        :placeholder="input_placeholder"
        :value="modelValue"
        @input="handleInput"
        class="font-semibold text-text-400 px-2 py-1 pr-12 border rounded w-full"
    />

    <button
        v-if="input_type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-2 top-1/2 -translate-y-1/2"
    >

        <HugeiconsIcon
            :icon="showPassword ? icons.ViewOffSlashIcon : icons.ViewIcon"
            color="currentColor"
            :size="20"
            :stroke-width="1.5"
        />

    </button>

</div>

</template>