// src/services/authService.js

import { jwtDecode } from 'jwt-decode'
import api from './api'
import { useUserStore } from '@/stores/userStore'

const aclURL = import.meta.env.VITE_API_ACL_URL; // Prod https://acl4.fazcomphp.com.br/

/**
 * Recupera a Lista de Menus do User que estão no paylodas do token JWT
 */
export function getMenus() {
  localStorage.getItem('menus')
}

/**
 * Armazena o token JWT
 */
export function setToken(token) {
  localStorage.setItem('token', token)
}

/**
 * Retorna o token JWT do localStorage
 */
export function getToken() {
  return localStorage.getItem('token')
}

export function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

/**
 * Remove o token do localStorage
 */
export function removeToken() {
  localStorage.removeItem('token')
}

export async function logout() { 
  try {
    const userStore = useUserStore()    

    // Limpar tokens
    removeAllTokens()
    
    // Limpar localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('currentEvent')
    localStorage.removeItem('eventos')
    localStorage.removeItem('menus')
    
    // Limpar a store completamente
    userStore.clear()    

    // Tenta fazer logout na API (não bloqueia)
    try {
      await api.post(aclURL + 'api/auth/logout')
    } catch (e) {
      console.warn('Erro no logout da API:', e)
    }
    
    return null

  } catch (error) {
    console.error('Erro no logout:', error);
    return null
  } 
}

/**
 * Faz logout: revoga o token na API + limpa token + limpa store
 */
export async function APAGARlogout() { 
  try {
    // Primeiro: limpar dados locais IMEDIATAMENTE
    const userStore = useUserStore()    

    // Limpar TUDO do localStorage (incluindo menus)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('currentEvent')
    localStorage.removeItem('eventos')
    localStorage.removeItem('menus') // ← ESSENCIAL: limpar menus
    
    // Limpar a store completamente
    userStore.clear()    

    // SÓ DEPOIS fazer request para logout na API
    // (não bloquear logout por falha na API)
    const response = await api.post(aclURL + 'api/auth/logout')
    
    return response    

  } catch (error) {
    console.error('Erro no logout:', error);
    return null
  } 
}

/**
 * Verifica se o token está presente e válido (não expirado)
 */
export function isAuthenticated() {
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp > now
  } catch (e) {
    return false
  }
}

/**
 * Verifica se o token está expirado
 */
export function isTokenExpired() {
  const token = getToken()
  if (!token) return true

  try {
    const decoded = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp <= now
  } catch (e) {
    return true
  }
}

/**
 * Decodifica o token
 */
export function decodeToken() {
  const token = getToken()
  try {
    return token ? jwtDecode(token) : null
  } catch {
    return null
  }
}

/**
 * Retorna o nome do usuário a partir do token
 */
export function getUserNameFromToken() {
  try {
    const decoded = decodeToken()
    return decoded?.user_name || null
  } catch (e) {
    console.error('Erro ao decodificar o token:', e)
    return null
  }
}

/**
 * Retorna os menus concedidos ao usuário segundo seu perfil de acesso
 */
export function getUserMenusFromToken() {
  try {
    const decoded = decodeToken();
    return Array.isArray(decoded?.user_menus) ? decoded.user_menus : [];
  } catch (e) {
    console.error('Erro ao decodificar o token:', e);
    return [];
  }
}

/**
 * Retorna o issuer do token (caso queira validar backend)
 */
export function getIssuer() {
  try {
    const decoded = decodeToken()
    return decoded?.iss || null
  } catch (e) {
    console.error('Erro ao decodificar o token:', e)
    return null
  }
}

/**
 * Troca de sistema (caso multitenancy)
 */
export async function selectSystem(systemId) {
  return await api.post('/auth/selectSystem', {
    systemId: systemId,
  })
}

// ==============================================
// REFRESH TOKEN
// ==============================================

/**
 * Armazena o refresh token
 */
export function setRefreshToken(refreshToken) {
  localStorage.setItem('refresh_token', refreshToken)
}

/**
 * Retorna o refresh token do localStorage
 */
export function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

/**
 * Remove o refresh token
 */
export function removeRefreshToken() {
  localStorage.removeItem('refresh_token')
}

/**
 * Tenta renovar o token usando o token atual (enviado no header)
 * Retorna o novo token ou null em caso de erro
 */
export async function refreshAccessToken() {
  try {
    // ✅ Usa a instância principal do api (já tem o token no header)
    // const response = await api.post('/auth/refresh');

    // ✅ Usar a URL do ACL4, não a do apieventos
    const response = await api.post(`${aclURL}api/auth/refresh`);    
    
    const newToken = response.data.token;
    
    if (newToken) {
      setToken(newToken);
      
      // Atualiza o store se necessário
      const userStore = useUserStore();
      userStore.token = newToken;
      
      return newToken;
    }
    
    console.warn('⚠️ Nenhum token retornado pelo refresh');
    return null;
  } catch (error) {
    console.error('❌ Erro ao renovar token:', error);
    return null;
  }
}

/**
 * Remove token e refresh token (logout)
 */
export function removeAllTokens() {
  removeToken()
  removeRefreshToken()
}
