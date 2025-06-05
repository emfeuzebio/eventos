<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1 class="pb-2">{{ appName }} <span class="fs-6 !text-sm !font-normal">v{{ appVersion }}</span></h1>
                  <h2>{{ $t('login.title') }}</h2>
                  <p class="text-body-secondary">{{ $t('login.subtitle') }}</p>

                  <CAlert v-if="errorMessage" color="danger" dismissible>
                    {{ errorMessage }}
                  </CAlert>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <!-- <CFormInput placeholder="Username" autocomplete="username" v-model="username"/> -->
                    <div ref="emailWrapper" style="flex: 1">
                      <CFormInput :placeholder="$t('login.email')" autocomplete="email" v-model="email" ref="emailInput"/>
                    </div>
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <!-- <CFormInput type="password" placeholder="Password" autocomplete="current-password" v-model="password"/> -->
                    <CFormInput type="password" :placeholder="$t('login.password')" autocomplete="current-password" v-model="password" />                    
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="5">
                      <!-- <CButton color="primary" class="px-4" @click="handleLogin" :disabled="loading"> Login </CButton> -->
                      <CButton color="primary" class="px-4" @click="handleLogin" :disabled="loading">{{ $t('login.btnLogin') }}</CButton>
                    </CCol>
                    <CCol :xs="7" class="text-right">
                      <!-- <CButton color="link" class="px-0" @click="goToForgotPassword">Forgot password?</CButton> -->
                      <CButton color="link" class="px-0" @click="goToForgotPassword">{{ $t('login.forgot') }}</CButton>
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
                <CButton color="light" variant="outline" class="mt-1" @click="goToRegister" :disabled="loading">
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

import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { setToken, decodeToken, getUserNameFromToken } from '@/services/authService'
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'

const appId = import.meta.env.VITE_APP_ID
const appName = import.meta.env.VITE_APP_NAME
const appVersion = import.meta.env.VITE_APP_VERSION

const email = ref('')
const userName = ref('')
const password = ref('')
const errorMessage = ref('')
const systems = ref([])
const isMobile = ref(false);
const inputWrapper = ref(null)
const emailWrapper = ref(null)

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const { locale } = useI18n()

const changeLocale = (event) => {
  locale.value = event.target.value
  localStorage.setItem('lang', locale.value)
}

const goToRegister = () => {
  router.push('/pages/register') // ou o nome da rota que você definiu
}

const goToForgotPassword = () => {
  router.push('/pages/forgotpassword') // ou o nome da rota que você definiu
}

const focusEmail = async () => {
  await nextTick()
  const input = emailWrapper.value?.querySelector('input')
  input?.focus()
}

const handleLogin = async () => {   

  errorMessage.value = ''
  loading.value = true

  try {
    // 1. Obter novo token específico do sistema
    // const response = await api.post('/auth/login', {    
    const response = await api.post('https://acl4.fazcomphp.com.br/api/auth/login', {    
      email: email.value,
      password: password.value,
      systemId: appId
    })

    // 2. armazena o token
    setToken(response.data.token)
    userStore.loadFromToken();  // carregar os dados do token dentro do Pinia userStore

    const decoded = decodeToken()
    // console.log('Decoded token:', decoded)
    systems.value = decoded?.user_systems || []
    userName.value = getUserNameFromToken()

    router.push('/dashboard')
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.status + ' - ' + error.response.data.error
    } else if (error.request) {
      errorMessage.value = 'Sem resposta do servidor. Verifique sua conexão.'
    } else {
      errorMessage.value = 'Erro inesperado: ' + error.message
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {

  isMobile.value = window.innerWidth < 768;

  // Foca no campo email
  nextTick(() => {
    const input = inputWrapper.value?.querySelector('input')
    input?.focus()
  })    

  // foca no campo email
  focusEmail()

})

</script>
