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
                        <h1>{{ $t('reset.title') }}</h1>
                        <p class="text-body-secondary">{{ $t('reset.subtitle') }}</p>

                        <CAlert v-if="successMessage" color="success" dismissible>
                           {{ successMessage }}
                        </CAlert>
                        <CAlert v-if="errorMessage" color="danger" dismissible>
                           {{ errorMessage }}
                        </CAlert>

                        <CInputGroup class="mb-3">
                           <CInputGroupText>
                              <CIcon icon="cil-lock-locked" />
                           </CInputGroupText>
                           <CFormInput
                              type="password"
                              :placeholder="$t('reset.password')"
                              autocomplete="new-password"
                              v-model="password"
                           />
                           <div class="form-text">{{ $t('reset.passwordHint') }}</div>
                        </CInputGroup>

                        <CInputGroup class="mb-4">
                           <CInputGroupText>
                              <CIcon icon="cil-lock-locked" />
                           </CInputGroupText>
                           <CFormInput
                              type="password"
                              :placeholder="$t('reset.passwordConfirm')"
                              autocomplete="new-password"
                              v-model="password_confirmation"
                           />
                        </CInputGroup>

                        <div class="d-grid">
                           <CButton color="primary" @click="handleReset" :disabled="loading">
                              {{ $t('reset.btn') }}
                           </CButton>
                           <CButton color="link" class="mt-3" @click="goToLogin">
                              {{ $t('reset.lnkBackToLogin') }}
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
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const appName = import.meta.env.VITE_APP_NAME;
const appVersion = import.meta.env.VITE_APP_VERSION;
const aclURL = import.meta.env.VITE_API_ACL_URL;

const token = ref(route.query.token || '');
const email = ref(route.query.email || '');
const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
   // força releitura dos query params a cada acesso
   token.value = route.query.token || '';
   email.value = route.query.email || '';

   const savedLang = localStorage.getItem('lang');
   if (savedLang) {
      locale.value = savedLang;
   } else {
      const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
      locale.value = ['en', 'pt'].includes(nav) ? nav : 'en';
   }
});

const goToLogin = () => {
   router.push('/pages/login');
};

const handleReset = async () => {
   errorMessage.value = '';
   successMessage.value = '';
   loading.value = true;

   if (!email.value || !token.value) {
      errorMessage.value = t('reset.errLink');
      loading.value = false;
      return;
   }

   if (!password.value || !password_confirmation.value) {
      errorMessage.value = t('reset.errFill');
      loading.value = false;
      return;
   }

   if (password.value !== password_confirmation.value) {
      errorMessage.value = t('reset.errMatch');
      loading.value = false;
      return;
   }

   try {
      const response = await api.post(aclURL + 'api/auth/resetPassword', {
         token: token.value,
         email: email.value,
         password: password.value,
         password_confirmation: password_confirmation.value,
      });

      successMessage.value = response.data.message || t('reset.success');
      setTimeout(() => router.push('/pages/login'), 2000);

   } catch (error) {
      errorMessage.value =
         (error.response?.status ? error.response.status + ' - ' : '') +
         (error.response?.data?.message || t('reset.errGeneric'));
   } finally {
      loading.value = false;
   }
};
</script>