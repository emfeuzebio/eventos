// src/services/authService.js

import { jwtDecode } from 'jwt-decode'
import api from './api'
import { useUserStore } from '@/stores/userStore'

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
    // const response = await api.post('/auth/logout')
    const response = await api.post('https://acl4.fazcomphp.com.br/api/auth/logout')
    const userStore = useUserStore()
    removeToken()
    userStore.clear()
  } catch (e) {
    console.error('Erro ao revogar o token:', e)
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
