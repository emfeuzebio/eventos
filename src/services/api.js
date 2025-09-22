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

   // caso usuário já autenticado getIssuer() retorna a URL que ele tem acesso, senão vai para URL padrão de login

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
  response => {
    stopLoading();
    return response;
  },
  async error => {
    stopLoading();

    const res = error.response;
    const status = res?.status || 'Desconhecido';
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    // Ignora tratamento se for a requisição de login
    if (isLoginRequest) return Promise.reject(error);

    // Redireciona para login se não autorizado (evita showError nesse caso)
    // if (status === 401) {
    //   removeToken();
    //   redirectToLogin();
    //   return new Promise(() => {}); // bloqueia execução posterior silenciosamente
    // }

    // ↓↓↓ Continua o tratamento normal para outros erros ↓↓↓

    let errorText = 'descrição não informada.';
    let message = '';

    if (res?.data instanceof Blob && res.data.type === 'application/json') {
      try {
        const text = await res.data.text();
        const parsed = JSON.parse(text);
        errorText = parsed.error || errorText;
        message = parsed.message || message;
      } catch (e) {
        console.warn('Erro ao interpretar JSON do blob:', e);
      }
    } else if (res?.data) {
      errorText = res.data.error || errorText;
      message = res.data.message || message;
    }

    // Exibe o erro (exceto validações 422)
    if (status !== 422) {
      showError(`<b>Erro ${status}</b> ${errorText}<br/>${message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
