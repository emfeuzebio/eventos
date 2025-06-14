// src/services/api.js
import axios from 'axios'
import { getToken, removeToken, getCookie, getIssuer } from './authService'
import router from '@/router/router'
;('@/router')
import { useGlobalError } from '@/composables/useGlobalError'

// console.log('xxx' + getIssuer());
const { showError } = useGlobalError() // fora do interceptor

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sua-api.com/api',
  // baseURL: 'https://acl4.fazcomphp.com.br/api',

  // caso usuário já autenticado getIssuer() retorna a URL que ele tem acesso, senão vai para URL padrão de login
  // baseURL: ( getIssuer() ?? 'https://acl4.fazcomphp.com.br' ) + '/api/',

  // TODO o backend está colocando no Issuer a URL dp site, mas deve colocar a URL da API
  // como abaixo. Estou forçando abaixo, mas o backend deve corrigir isso.
  baseURL: 'https://apieventos.fazcomphp.com.br/api/',
  timeout: 10000, // aguarda a resposta por 10s
  withCredentials: false, // Desative CSRF quando usar JWT
})

// Adiciona o token JWT a cada request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Se a resposta for 401, redireciona para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    if (error.response && error.response.status === 401) {      
      removeToken()
      router.push('/pages/login')
    } else if (error.response?.status == 419) {
      showError(error.response?.data?.error || '419 - Erro inesperado.')
    } // Não sendo erros de campos do formulário (422), exibe o erro
    else if (error.response?.status != 422) {
      showError(error.response?.data?.error || 'Erro inesperado.')
    }
    // demais erros são capturados noutro local

    return Promise.reject(error)
  }
)

export default api
