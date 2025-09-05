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

  const aclURL = import.meta.env.VITE_API_ACL_URL; // https://acl4.azcomphp.com.br/

  // Validação de Autenticação no backend (evita tokens expirados ou revogados)
  try {
    await api.get(aclURL + 'api/auth/isTokenValid') // deve estar protegido com auth middleware
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
