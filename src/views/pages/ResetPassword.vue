<template>
   <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
         <CRow class="justify-content-center">
            <CCol :md="9" :lg="7" :xl="6">
               <CCard class="mx-4">
                  <CCardBody class="p-4">
                     <CForm>
                        <h1 class="pb-2">
                           {{ appName }}
                           <span class="fs-6 !text-sm !font-normal">v{{ appVersion }}</span>
                        </h1>
                        <h1>{{ $t('reset.title') || 'Reset Password' }}</h1>
                        <p class="text-body-secondary">
                           {{ $t('reset.subtitle') || 'Set your new password' }}
                        </p>

                        <CAlert v-if="successMessage" color="success" dismissible>
                           {{ successMessage }}
                        </CAlert>
                        <CAlert v-if="errorMessage" color="danger" dismissible>
                           {{ errorMessage }}
                        </CAlert>

                        <CInputGroup class="mb-3">
                           <CFormInput
                              type="password"
                              :placeholder="$t('reset.password') || 'New password'"
                              v-model="password"
                              autocomplete="new-password"
                           />
                        </CInputGroup>

                        <CInputGroup class="mb-4">
                           <CFormInput
                              type="password"
                              :placeholder="$t('reset.passwordConfirm') || 'Confirm password'"
                              v-model="passwordConfirmation"
                              autocomplete="new-password"
                           />
                        </CInputGroup>

                        <div class="d-grid">
                           <CButton color="primary" @click="handleReset" :disabled="loading">
                              {{ $t('reset.btn') || 'Reset Password' }}
                           </CButton>
                           <CButton color="link" class="mt-3" @click="goToLogin">
                              {{ $t('reset.lnkBackToLogin') || 'Back to Login' }}
                           </CButton>
                        </div>
                     </CForm>
                  </CCardBody>
               </CCard>
            </CCol>
         </CRow>
      </CContainer>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';

const appName = import.meta.env.VITE_APP_NAME;
const appVersion = import.meta.env.VITE_APP_VERSION;
const aclURL = import.meta.env.VITE_API_ACL_URL;

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const token = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

onMounted(() => {
   const savedLang = localStorage.getItem('lang');
   if (savedLang) locale.value = savedLang;

   // lê token e email da query (?token=...&email=...)
   token.value = route.query.token || '';
   email.value = route.query.email || '';

   if (!token.value || !email.value) {
      errorMessage.value = 'Link inválido ou incompleto.';
   }
});

const goToLogin = () => router.push('/pages/login');

const handleReset = async () => {
   errorMessage.value = '';
   successMessage.value = '';
   loading.value = true;

   try {
      const response = await api.post(aclURL + 'api/auth/resetPassword', {
         email: email.value,
         token: token.value,
         password: password.value,
         password_confirmation: passwordConfirmation.value,
      });

      if (response.status === 200) {
         successMessage.value = response.data.message || 'Senha redefinida com sucesso.';
         setTimeout(() => router.push('/pages/login'), 2000);
      } else {
         errorMessage.value = 'Resposta inesperada do servidor.';
      }
   } catch (error) {
      if (error.response?.data?.message) {
         errorMessage.value = error.response.status + ' - ' + error.response.data.message;
      } else {
         errorMessage.value = 'Ocorreu um erro. Tente novamente.';
      }
   } finally {
      loading.value = false;
   }
};
</script>