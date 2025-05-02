// src/services/api.js
import axios from 'axios'
import { getToken, removeToken, getIssuer } from './authService'
import router from '@/router/router'
 '@/router'
import { useGlobalStore } from '@/stores/globalStore'

// console.log('xxx' + getIssuer());

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sua-api.com/api',
  // baseURL: 'https://acl4.fazcomphp.com.br/api',

  // caso usuário já autenticado getIssuer() retorna a URL que ele tem acesso, senão vai para URL padrão de login
  baseURL: ( getIssuer() ?? 'https://acl4.fazcomphp.com.br' ) + '/api/',   
  timeout: 10000,   // aguarda a resposta por 10s
})

// Adiciona o token a cada request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Se a resposta for 401, redireciona para login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      removeToken()
      router.push('/pages/login')
    }
    return Promise.reject(error)
  }
)

export default api
