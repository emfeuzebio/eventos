// src/utils/routerHelper.js
import router from '@/router/router'

let routerInstance = null

export function setRouterInstance(router) {
  routerInstance = router
}

export function redirectToLogin(message = null) {
  // ✅ Salva a mensagem (usando localStorage para persistir mesmo com reload)
  if (message) {
    localStorage.setItem('login_message', message)
    console.log('🔴 Mensagem salva no localStorage:', message)
  }

  // ✅ Tenta usar o routerInstance (se disponível)
  if (routerInstance && typeof routerInstance.push === 'function') {
    console.log('🔴 Redirecionando via router.push()')
    routerInstance.push('/pages/login')
    return
  }

  // ✅ Tenta usar o router importado diretamente (fallback)
  try {
    if (router && typeof router.push === 'function') {
      console.log('🔴 Redirecionando via router importado')
      router.push('/pages/login')
      return
    }
  } catch (e) {
    console.warn('⚠️ Erro ao usar router importado:', e)
  }

  // ⚠️ Último recurso: window.location (recarrega a página)
  console.warn('⚠️ Fallback: redirecionando com window.location')
  window.location.href = '/#/pages/login'
}