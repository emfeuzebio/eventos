// src/services/api.js
import axios from 'axios';
import { 
  getToken, 
  removeAllTokens, 
  refreshAccessToken 
} from './authService';
import { useGlobalError } from '@/composables/useGlobalError';
import { useGlobalLoading } from '@/stores/loading';
import { redirectToLogin } from '@/utils/routerHelper'

const { showError } = useGlobalError();
const apiURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiURL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const { startLoading, stopLoading } = useGlobalLoading();

// ==============================================
// INTERCEPTOR DE REQUISIÇÕES
// ==============================================
api.interceptors.request.use((config) => {
  startLoading();
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================================
// INTERCEPTOR DE RESPOSTAS COM REFRESH TOKEN
// ==============================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Função auxiliar para tratar outros códigos de erro
const handleOtherErrors = async (error) => {
  const res = error.response;
  const status = res?.status || 'Desconhecido';
  const isLoginRequest = error.config?.url?.includes('/auth/login');

  if (isLoginRequest) {
    return Promise.reject(error);
  }

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

  if (status !== 422) {
    showError(`<b>Erro ${status}</b> ${errorText}<br/>${message}`);
  }

  return Promise.reject(error);
};

// Interceptor de respostas
api.interceptors.response.use(
  response => {
    stopLoading();
    return response;
  },
  async error => {
    stopLoading();

    const originalRequest = error.config;
    const status = error.response?.status;
    const isLoginRequest = originalRequest?.url?.includes('/auth/login');
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    // Ignora tratamento para login e refresh
    if (isLoginRequest || isRefreshRequest) {
      return Promise.reject(error);
    }

    // Se não for 401, trata erro normal
    if (status !== 401) {
      return handleOtherErrors(error);
    }

    // Se já tentou renovar, não tenta de novo
    if (originalRequest._retry) {
      removeAllTokens();
      redirectToLogin(message);
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Se já está renovando, enfileira a requisição
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        processQueue(error, null);
        removeAllTokens();
        redirectToLogin(message);
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      removeAllTokens();

      // ✅ Captura a mensagem de erro
      const errorMessage = refreshError?.response?.data?.error
        || refreshError?.error	
        || 'Sua sessão expirou. Faça login novamente.';

      // ✅ Exibe erro para o usuário (antes de redirecionar)
      // showError(`<b>Sessão expirada</b><br/>${errorMessage}`);

      // ✅ Redireciona para login com a mensagem
      redirectToLogin(errorMessage);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;