// src/utils/routerHelper.js
import router from '@/router/router'

let routerInstance = null

export function setRouterInstance(router) {
  routerInstance = router
}

export function redirectToLogin() {
  if (routerInstance) {
    routerInstance.push('/pages/login')
  } else {
    console.warn('Router instance not set. Cannot redirect to login.')
  }
}


