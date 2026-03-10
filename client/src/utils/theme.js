import { ref, computed } from 'vue'

export const theme = ref('dark')

export const themeClasses = computed(() => {
  return theme.value === 'light'
    ? 'bg-bg-light-1 text-text-900'
    : 'bg-bg-dark-1 text-text-100'
})

export function toggleTheme() {
  theme.value =
    theme.value === 'dark'
      ? 'light'
      : 'dark'
}