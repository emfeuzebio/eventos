<template>
  <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm>
                <p>{{ locale }}</p>
                <h1>{{ $t('register.title') }}</h1>
                <p class="text-body-secondary">{{ $t('register.subtitle') }}</p>

                <CAlert v-if="errorMessage" color="danger" dismissible> 
                  {{ errorMessage }}
                </CAlert>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput :placeholder="$t('register.user')" autocomplete="username" v-model="username" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput :placeholder="$t('register.email')" autocomplete="email" v-model="email" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    :placeholder="$t('register.password')"
                    autocomplete="new-password"
                    v-model="password"
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    :placeholder="$t('register.repeatPassword')"
                    autocomplete="new-password"
                    v-model="password_confirmation"
                  />
                </CInputGroup>
                <div class="d-grid">
                  <CButton color="success" @click="handleRegister" :disabled="loading">{{ $t('register.btnCreateAccount') }}</CButton>
                  <CButton color="link" class="mt-3" @click="goToLogin">{{ $t('register.lnkToLogin') }}</CButton>
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

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useI18n } from 'vue-i18n'

const username = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref('')
const { locale } = useI18n()

// const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)

// Aplica o idioma salvo ao carregar a página
onMounted(() => {
  const savedLang = localStorage.getItem('lang')
  // console.log('Saved language:', savedLang)
  if (savedLang) {
    locale.value = savedLang
  }
})  


const goToLogin = () => {
  router.push('/pages/login') // ou { name: 'Login' } se estiver usando name
}

const handleRegister = async () => {

  errorMessage.value = '' // limpa erro antes
  loading.value = true
  error.value = null
  try {
    const response = await api.post('/auth/register', {
      name: username.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    // console.log('Registro OK:', response)
    // TODO terminar, criar o token usuário mas mostra erro sempre a pesar do sucesso create 201

      // setToken(response.data.token)
      // userStore.loadFromToken()
      // alert('Registration successful! Please check your email for verification.'); 
      // router.push('/dashboard') 

    
    if (response.status === 201) {
      // setToken(response.data.token)
      // // userStore.loadFromToken()
      // alert('Registration successful! Please check your email for verification.'); 
      // router.push('/dashboard') 
    } else {
      errorMessage.value = 'Unexpected response from server.'
    }    

    // setToken(response.data.token)
    // userStore.loadFromToken()
    // router.push('/dashboard')

  } catch (error) {
    // console.log('Erro na API:', error)

    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.status + ' - ' + error.response.data.message
    } 
    else {
      errorMessage.value = 'An unexpected error occurred.'
      setToken(response.data.token)
      userStore.loadFromToken()
      // alert('Registration successful! Please check your email for verification.'); 
      router.push('/dashboard') 
    }
  } finally {
    loading.value = false
  }
}

</script>
