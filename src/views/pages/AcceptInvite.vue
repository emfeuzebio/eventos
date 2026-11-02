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
                        <h1>{{ $t('accept.title') }}</h1>
                        <p class="text-body-secondary">{{ $t('accept.subtitle') }}</p>

                        <CAlert v-if="successMessage" color="success" dismissible>
                           {{ successMessage }}
                        </CAlert>
                        <CAlert v-if="errorMessage" color="danger" dismissible>
                           {{ errorMessage }}
                        </CAlert>

                        <div v-if="userName" class="mb-3">
                           <strong>{{ userName }}</strong><br>
                           <span class="text-body-secondary">{{ userEmail }}</span>
                        </div>

                        <CInputGroup class="mb-3">
                           <CInputGroupText><CIcon icon="cil-lock-locked" /></CInputGroupText>
                           <CFormInput
                              :type="showPassword ? 'text' : 'password'"
                              :placeholder="$t('accept.password')"
                              autocomplete="new-password"
                              v-model="password"
                           />
                           <CInputGroupText @click="showPassword = !showPassword" style="cursor:pointer; user-select:none;">
                              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                           </CInputGroupText>
                        </CInputGroup>
                        <div class="form-text mb-3">{{ $t('accept.passwordHint') }}</div>

                        <CInputGroup class="mb-4">
                           <CInputGroupText><CIcon icon="cil-lock-locked" /></CInputGroupText>
                           <CFormInput
                              :type="showPasswordConfirm ? 'text' : 'password'"
                              :placeholder="$t('accept.passwordConfirm')"
                              autocomplete="new-password"
                              v-model="password_confirmation"
                           />
                           <CInputGroupText @click="showPasswordConfirm = !showPasswordConfirm" style="cursor:pointer; user-select:none;">
                              <i :class="showPasswordConfirm ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                           </CInputGroupText>
                        </CInputGroup>

                        <div class="d-grid">
                           <CButton color="primary" @click="handleAccept" :disabled="loading || !validInvite">
                              {{ $t('accept.btn') }}
                           </CButton>
                           <CButton color="link" class="mt-3" @click="goToLogin">
                              {{ $t('accept.lnkBackToLogin') }}
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
const userName = ref('');
const userEmail = ref('');
const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const validInvite = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

onMounted(async () => {
   const savedLang = localStorage.getItem('lang');
   if (savedLang) {
      locale.value = savedLang;
   } else {
      const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
      locale.value = ['en', 'pt'].includes(nav) ? nav : 'en';
   }

   token.value = route.query.token || '';

   if (!token.value) {
      errorMessage.value = t('accept.errLink');
      return;
   }

   try {
      const { data } = await api.get(aclURL + 'api/auth/invite/' + token.value);
      userName.value = data.name;
      userEmail.value = data.email;
      validInvite.value = true;
   } catch (e) {
      errorMessage.value = e.response?.data?.error || t('accept.errInvalid');
   }
});

const goToLogin = () => router.push('/pages/login');

const handleAccept = async () => {
   errorMessage.value = '';
   successMessage.value = '';
   loading.value = true;

   if (!password.value || !password_confirmation.value) {
      errorMessage.value = t('accept.errFill');
      loading.value = false;
      return;
   }

   if (password.value !== password_confirmation.value) {
      errorMessage.value = t('accept.errMatch');
      loading.value = false;
      return;
   }

   try {
      const { data } = await api.post(aclURL + 'api/auth/invite/' + token.value, {
         password: password.value,
         password_confirmation: password_confirmation.value,
      });

      successMessage.value = data.message || t('accept.success');
      setTimeout(() => router.push('/pages/login'), 2000);

   } catch (e) {
      errorMessage.value =
         (e.response?.status ? e.response.status + ' - ' : '') +
         (e.response?.data?.message || e.response?.data?.error || t('accept.errGeneric'));
   } finally {
      loading.value = false;
   }
};
</script>