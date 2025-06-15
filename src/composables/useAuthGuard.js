// src/composables/useAuthGuard.js

import { isAuthenticated, isTokenExpired, removeToken } from '@/services/authService'
import api from '@/services/api'
import router from '@/router/router'

export async function checkAuthBeforeSensitiveAction() {
  // Verificação de Autenticação local (rápida)
  if (!isAuthenticated() || isTokenExpired()) {
    handleExpiredToken()
    return false
  }

  // Validação de Autenticação no backend (evita tokens expirados ou revogados)
  try {
    await api.get('https://acl4.fazcomphp.com.br/api/auth/isTokenValid') // deve estar protegido com auth middleware
    return true
  } catch (error) {
    handleExpiredToken()
    return false
  }
}

function handleExpiredToken() {
  removeToken()
  router.push('/pages/login')
}
