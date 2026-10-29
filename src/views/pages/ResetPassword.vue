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

                        <!-- Campo senha com olho -->
                        <CInputGroup class="mb-3">
                           <CInputGroupText>
                              <CIcon icon="cil-lock-locked" />
                           </CInputGroupText>
                           <CFormInput
                              :type="showPassword ? 'text' : 'password'"
                              :placeholder="$t('reset.password')"
                              autocomplete="new-password"
                              v-model="password"
                           />
                           <CInputGroupText
                              @click="togglePasswordVisibility"
                              style="cursor: pointer; user-select: none;"
                           >
                              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                           </CInputGroupText>
                        </CInputGroup>
                        <div class="form-text mb-3">{{ $t('reset.passwordHint') }}</div>

                        <!-- Campo confirmar senha com olho -->
                        <CInputGroup class="mb-4">
                           <CInputGroupText>
                              <CIcon icon="cil-lock-locked" />
                           </CInputGroupText>
                           <CFormInput
                              :type="showPasswordConfirm ? 'text' : 'password'"
                              :placeholder="$t('reset.passwordConfirm')"
                              autocomplete="new-password"
                              v-model="password_confirmation"
                           />
                           <CInputGroupText
                              @click="togglePasswordConfirmVisibility"
                              style="cursor: pointer; user-select: none;"
                           >
                              <i :class="showPasswordConfirm ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                           </CInputGroupText>
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

const token = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// olho de senha
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const togglePasswordVisibility = () => {
   showPassword.value = !showPassword.value;
};

const togglePasswordConfirmVisibility = () => {
   showPasswordConfirm.value = !showPasswordConfirm.value;
};

onMounted(() => {
   // sempre relê a query (evita estado velho do cache/instância)
   token.value = route.query.token || '';
   email.value = route.query.email || '';
   password.value = '';
   password_confirmation.value = '';
   errorMessage.value = '';
   successMessage.value = '';

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