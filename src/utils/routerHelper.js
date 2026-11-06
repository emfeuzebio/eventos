// src/utils/routerHelper.js
import router from '@/router/router'

let routerInstance = null

export function setRouterInstance(r) {
  routerInstance = r
}

export function redirectToLogin(message = null) {
  if (message) {
    localStorage.setItem('login_message', message)
  }

  // ✅ SEMPRE usa o router (nunca window.location)
  const r = routerInstance || router
  r.push('/pages/login')
}