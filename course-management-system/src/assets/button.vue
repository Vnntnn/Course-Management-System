<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: Object,
    default: null
  },
  variant: {
    type: String,
    default: 'primary_solid'
  },
  size: {
    type: String,
    default: 'small'
  }
})

const classes = computed(() => {
  const base =
    'inline-flex items-center rounded-xl transition-colors duration-200 hover:cursor-pointer'

  const size = {
    small: 'px-4 py-2',
    large: 'px-6 py-4 text-xl font-semibold gap-4'
  }

  const variants = {
    primary_solid: 'bg-ci-primary text-text-100 hover:bg-ci-secondary-2',
    primary_border: 'border hover:bg-ci-secondary-2/50',
    disabled: 'bg-disabled-1 text-disabled-2 hover:cursor-not-allowed'
  }

  return `${base} ${size[props.size]} ${variants[props.variant] || ''}`
})
</script>

<template>
  <button :class="classes">
    <HugeiconsIcon v-if="icon" :icon="icon" :size="18" />
    <slot />
  </button>
</template>