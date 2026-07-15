// src/composables/useTokenRenewal.js
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { refreshAccessToken, isAuthenticated } from '@/services/authService';
import { useToast } from './useToast';
import { useRouter } from 'vue-router';

export function useTokenRenewal() {
  const { showToast } = useToast();
  const router = useRouter();
  
  let renewalInterval = null;
  let inactivityTimer = null;
  const isUserActive = ref(true);
  const lastRenewal = ref(null);
  const renewalAttempts = ref(0);

  const RENEWAL_INTERVAL = 10 * 60 * 1000; // 10 minutos
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos

  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

  // ==============================================
  // DETECÇÃO DE ATIVIDADE DO USUÁRIO
  // ==============================================
  
  const handleUserActivity = () => {
    isUserActive.value = true;
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      isUserActive.value = false;
    }, INACTIVITY_TIMEOUT);
  };

  // ==============================================
  // RENOVAÇÃO DO TOKEN
  // ==============================================

  const renewToken = async () => {
    if (!isAuthenticated()) {
      console.log('🔴 Usuário não autenticado, cancelando renovação');
      return;
    }

    if (!isUserActive.value) {
      console.log('🟡 Usuário inativo, não renovando token');
      return;
    }

    try {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        lastRenewal.value = new Date();
        renewalAttempts.value = 0;
        console.log('✅ Token renovado com sucesso!', lastRenewal.value.toLocaleTimeString());
      } else {
        renewalAttempts.value++;
        console.warn(`⚠️ Falha ao renovar token (tentativa ${renewalAttempts.value})`);
        
        // Se falhar 3 vezes seguidas, redireciona para login
        if (renewalAttempts.value >= 3) {
          console.error('❌ Múltiplas falhas ao renovar token. Redirecionando para login...');
          showToast({
            title: 'Sessão expirada',
            message: 'Sua sessão expirou. Faça login novamente.',
            color: 'danger',
          });
          router.push('/pages/login');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao renovar token:', error);
      renewalAttempts.value++;
    }
  };

  // ==============================================
  // INICIAR / PARAR
  // ==============================================

  const startRenewal = () => {
    stopRenewal();

    // Adicionar listeners de atividade
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    isUserActive.value = true;

    // Timer de inatividade
    inactivityTimer = setTimeout(() => {
      isUserActive.value = false;
    }, INACTIVITY_TIMEOUT);

    // Intervalo de renovação
    renewalInterval = setInterval(renewToken, RENEWAL_INTERVAL);
    console.log('🔄 Timer de renovação iniciado (a cada 10 minutos)');
    
    // Fazer uma renovação imediata ao iniciar
    setTimeout(() => renewToken(), 5000);
  };

  const stopRenewal = () => {
    if (renewalInterval) {
      clearInterval(renewalInterval);
      renewalInterval = null;
    }
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
    events.forEach(event => {
      document.removeEventListener(event, handleUserActivity);
    });
    console.log('⏹️ Timer de renovação parado');
  };

  // ==============================================
  // CICLO DE VIDA
  // ==============================================

  onMounted(() => {
    if (isAuthenticated()) {
      startRenewal();
    }
  });

  onUnmounted(() => {
    stopRenewal();
  });

  // ==============================================
  // EXPOSIÇÃO
  // ==============================================

  return {
    isUserActive,
    lastRenewal,
    renewalAttempts,
    startRenewal,
    stopRenewal,
    renewToken,
  };
}