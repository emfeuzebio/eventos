// src/utils/routerHelper.js
import router from '@/router/router'

export function redirectToLogin() {
  // Evita múltiplos redirecionamentos simultâneos
  if (router.currentRoute.value.path !== '/pages/login') {
    router.push({ path: '/pages/login', replace: true })
  }
}
