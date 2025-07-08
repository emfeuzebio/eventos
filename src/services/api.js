// src/services/api.js
import axios from 'axios';
import { getToken, removeToken, getCookie, getIssuer } from './authService';
import router from '@/router/router';
('@/router');
import { useGlobalError } from '@/composables/useGlobalError';
import { useGlobalLoading } from '@/stores/loading';

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

// Se a resposta for 401, redireciona para login
api.interceptors.response.use(
   (response) => {
      stopLoading();
      return response;
   },
   (error) => {
      stopLoading();

      // Tratamento simplificado para erros CORS
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
         return Promise.reject({ 
         message: 'Erro de conexão com o servidor',
         isNetworkError: true 
         });
      }      

      if (error.response && error.response?.status == 401) {
         // '401 - Token não fornecido ou malformado > Go to Page Login.')
         removeToken();
         router.push('/pages/login');
         // Não propaga o erro para evitar stack trace no console
         return new Promise(() => {}); // retorna uma promessa pendente (sem erro)
      } else if (error.response?.status == 400) {
         showError(error.response?.data?.error + "\n" + error.response?.data?.message || '400 - Erro inesperado.');
      } else if (error.response?.status == 404) {
         showError(error.response?.data?.error + "\n" + error.response?.data?.message || '404 - Erro ao acessar o Recurso.');
      } else if (error.response?.status == 409) {
         // Use 409 Conflict para erros de restrição de integridade (MySQL 23000)
         showError(error.response?.data?.error + "\n" + error.response?.data?.message || '409 - Erro de onflito de estado/regras.');
      } else if (error.response?.status == 419) {
         showError(error.response?.data?.error || '419 - Erro inesperado.');
      } else if (error.response && error.response?.status == 404) {
         showError(error.response?.data?.message || '404 - Erro inesperado.');
      }
      // Não sendo erros de campos do formulário (422), exibe o erro
      else if (error.response?.status != 422) {
         showError(error.response?.data?.error || '419 - Erro inesperado.');
      }
      // demais erros são capturados noutro local

      return Promise.reject(error);
   }
);

export default api;
