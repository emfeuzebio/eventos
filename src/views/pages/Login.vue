<template>
   <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
         <CRow class="justify-content-center">
            <CCol :md="8">
               <CCardGroup>
                  <CCard class="p-4">
                     <CCardBody>
                        <CForm>
                           <h1 class="pb-2">
                              {{ appName }}
                              <span class="fs-6 !text-sm !font-normal"
                                 >v{{ appVersion }}</span
                              >
                           </h1>
                           <h2>{{ $t('login.title') }}</h2>
                           <p class="text-body-secondary">
                              {{ $t('login.subtitle') }}
                           </p>

                           <CAlert
                              v-if="errorMessage"
                              color="danger"
                              dismissible
                           >
                              {{ errorMessage }}
                           </CAlert>

                           <CInputGroup class="mb-3">
                              <CInputGroupText>
                                 <CIcon icon="cil-user" />
                              </CInputGroupText>
                              <!-- <CFormInput placeholder="Username" autocomplete="username" v-model="username"/> -->
                              <div ref="emailWrapper" style="flex: 1">
                                 <CFormInput
                                    :placeholder="$t('login.email')"
                                    autocomplete="email"
                                    v-model="email"
                                    ref="emailInput"
                                 />
                              </div>
                           </CInputGroup>
                           <CInputGroup class="mb-4">
                              <CInputGroupText>
                                 <CIcon icon="cil-lock-locked" />
                              </CInputGroupText>
                              <!-- <CFormInput type="password" placeholder="Password" autocomplete="current-password" v-model="password"/> -->
                              <CFormInput
                                 type="password"
                                 :placeholder="$t('login.password')"
                                 autocomplete="current-password"
                                 v-model="password"
                              />
                           </CInputGroup>
                           <CRow>
                              <CCol :xs="5">
                                 <!-- <CButton color="primary" class="px-4" @click="handleLogin" :disabled="loading"> Login </CButton> -->
                                 <CButton
                                    color="primary"
                                    class="px-4"
                                    @click="handleLogin"
                                    :disabled="loading"
                                    >{{ $t('login.btnLogin') }}</CButton
                                 >
                              </CCol>
                              <CCol :xs="7" class="text-right">
                                 <!-- <CButton color="link" class="px-0" @click="goToForgotPassword">Forgot password?</CButton> -->
                                 <CButton
                                    color="link"
                                    class="px-0"
                                    @click="goToForgotPassword"
                                    >{{ $t('login.forgot') }}</CButton
                                 >
                              </CCol>
                           </CRow>
                        </CForm>

                        <!-- Seletor de idioma -->
                        <CInputGroup class="mb-3 mt-3">
                           <CInputGroupText as="label" for="inputGroupSelect01">
                              {{ $t('login.language') }}
                           </CInputGroupText>
                           <CFormSelect v-model="locale" @change="changeLocale">
                              <option value="en">English</option>
                              <option value="pt">Português</option>
                           </CFormSelect>
                        </CInputGroup>
                     </CCardBody>
                  </CCard>

                  <CCard class="text-white bg-primary py-1">
                     <CCardBody class="text-center">
                        <h4>{{ $t('login.noAccountTitle') }}</h4>
                        <p>{{ $t('login.noAccountSubtitle') }}</p>
                        <CButton
                           color="light"
                           variant="outline"
                           class="mt-1"
                           @click="goToRegister"
                           :disabled="loading"
                        >
                           {{ $t('login.register') }}
                        </CButton>
                     </CCardBody>
                  </CCard>
               </CCardGroup>
            </CCol>
         </CRow>
      </CContainer>
   </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import {
   setToken,
   decodeToken,
   getUserNameFromToken,
} from '@/services/authService';
import { useUserStore } from '@/stores/userStore';
import { useI18n } from 'vue-i18n';

const appId = import.meta.env.VITE_APP_ID;
const appName = import.meta.env.VITE_APP_NAME;
const appVersion = import.meta.env.VITE_APP_VERSION;
const aclURL = import.meta.env.VITE_API_ACL_URL; // Prod https://acl4.fazcomphp.com.br/

const email = ref('');
const userName = ref('');
const password = ref('');
const errorMessage = ref('');
const systems = ref([]);
const isMobile = ref(false);
const inputWrapper = ref(null);
const emailWrapper = ref(null);

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const error = ref(null);
const { locale } = useI18n();

const changeLocale = (event) => {
   locale.value = event.target.value;
   localStorage.setItem('lang', locale.value);
};

const goToRegister = () => {
   router.push('/pages/register'); // ou o nome da rota que você definiu
};

const goToForgotPassword = () => {
   router.push('/pages/forgotpassword'); // ou o nome da rota que você definiu
};

const focusEmail = async () => {
   await nextTick();
   const input = emailWrapper.value?.querySelector('input');
   input?.focus();
};

// ✅ 1. Funções para validação do formulário
const validateForm = () => {
   if (!email.value.trim() || !password.value.trim()) {
      return 'Preencha email e senha';
   }

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email.value.trim())) {
      return 'Email inválido';
   }

   if (password.value.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
   }

   return null;
};

const handleLogin = async () => {
   errorMessage.value = '';
   loading.value = true;

   // ✅ 2. Chama Validação do formulário
   const validationError = validateForm();
   if (validationError) {
      errorMessage.value = validationError;
      loading.value = false;
      return;
   }

   try {
      // ✅ 3. Limpa os dados anteriores (CRÍTICO!)
      userStore.clear();

      // ✅ 4. Requisição de login na API ACL - usando o interceptor em api.js
      const response = await api.post(aclURL + 'api/auth/login', {
         email: email.value.trim().toLowerCase(), // Normaliza email
         password: password.value.trim(), // Senha sem espaços
         systemId: appId, // informa o System ID
      });

      if (!response.data.token) {
         throw new Error('Token não recebido do servidor');
      }

      // ✅ 5. Salva o Token na store
      setToken(response.data.token);

      // ✅ 6. Recupera dados do token e carrega no store do User
      // Aqui carrega todos os dados do usuário: id, name, email, roles, menus, abilities, etc.
      const userLoaded = userStore.loadFromToken();
      if (!userLoaded) {
         throw new Error('Falha ao carregar dados do usuário');
      }

      // ✅ 7. Verifica se os menus foram carregados
      if (!userStore.menus || userStore.menus.length === 0) {
         console.warn('Usuário logado mas sem menus definidos');
      }

      // ✅ 8. Redireciona com sucesso para o Dashboard
      router.push('/dashboard');

      // const decoded = decodeToken();
      // // console.log('Decoded token:', decoded)
      // systems.value = decoded?.user_systems || [];
      // userName.value = getUserNameFromToken();
   } catch (error) {
      // ✅ 9. Tratamento de erros
      let message = 'Erro durante login';

      if (error.response) {
         message =
            error.response.data?.message ||
            `Erro ${error.response.status}: ${
               error.response.data?.error || 'Falha na autenticação'
            }`;
      } else if (error.request) {
         message = 'Sem resposta do servidor. Verifique sua conexão.';
      } else {
         message = error.message;
      }

      errorMessage.value = message;

      // ✅ 10. Garantir a limpeza em caso de erro
      userStore.clear();

      // if (error.response) {
      //    errorMessage.value =
      //       error.response.status + ' - ' + error.response.data.error;
      // } else if (error.request) {
      //    errorMessage.value =
      //       'Sem resposta do servidor. Verifique sua conexão.';
      // } else {
      //    errorMessage.value = 'Erro inesperado: ' + error.message;
      // }
   } finally {
      loading.value = false;
   }
};

onMounted(() => {
   isMobile.value = window.innerWidth < 768;

   // Foca no campo email
   nextTick(() => {
      const input = inputWrapper.value?.querySelector('input');
      input?.focus();
   });

   // foca no campo email
   focusEmail();
});
</script>
