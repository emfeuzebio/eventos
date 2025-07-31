// src/services/api.js
import axios from 'axios';
import { getToken, removeToken, getCookie, getIssuer } from './authService';

('@/router');
import { useGlobalError } from '@/composables/useGlobalError';
import { useGlobalLoading } from '@/stores/loading';
import { redirectToLogin } from '@/utils/routerHelper'

// console.log('xxx' + getIssuer());
const { showError } = useGlobalError(); // fora do interceptor
const apiURL = import.meta.env.VITE_API_BASE_URL; // https://apieventos.fazcomphp.com.br/api/

const api = axios.create({
   // baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sua-api.com/api',
   // baseURL: 'https://acl4.fazcomphp.com.br/api',

   // caso usuário já autenticado getIssuer() retorna a URL que ele tem acesso, senão vai para URL padrão de login
   // baseURL: ( getIssuer() ?? 'https://acl4.fazcomphp.com.br' ) + '/api/',

   // TODO o backend está colocando no Issuer a URL dp site, mas deve colocar a URL da API
   // como abaixo. Estou forçando abaixo, mas o backend deve corrigir isso.
   baseURL: apiURL,
   timeout: 10000, // aguarda a resposta por 10s
   withCredentials: false, // Desative CSRF quando usar JWT
   headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
   }
});

const { startLoading, stopLoading } = useGlobalLoading();

// Adiciona o token JWT a cada request
api.interceptors.request.use((config) => {
   startLoading();
   const token = getToken();
   if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
});

// intercepta todas requisições e respostas
api.interceptors.response.use(
   (response) => {
      stopLoading();
      return response;
   },
   (error) => {
      stopLoading();
      // console.log('interceptors Erro status:', error.response?.status)

      // '401 - Forbiden - Token expirado ou inválido > Go to Page Login.')
      // Se a resposta for 401, redireciona para login
      if (error.response?.status == 401) {
         removeToken()
         redirectToLogin()
         return new Promise(() => {}) // evita erro no console
      } 
      // Para todos demais erros diferentes de 422, exibe o erro
      else if (error.response?.status != 422) {
         showError("<b>Erro " + error.response?.status + "</b> " + (error.response?.data?.error || 'descrição não informada.') + "<br/> " + ( error.response?.data?.message || ''));
      }

      return Promise.reject(error);
   }
);

export default api;
