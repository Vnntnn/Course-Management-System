import router from '@/router'

export function go(page) {
  router.push(page)
}

export function goBack() {
  router.back()
}