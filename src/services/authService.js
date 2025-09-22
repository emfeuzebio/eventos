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

/**
 * Faz logout: revoga o token na API + limpa token + limpa store
 */
export async function logout() { 
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
 * Retorna os menus concedidos ao usuário segundo seu partir de acesso
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
