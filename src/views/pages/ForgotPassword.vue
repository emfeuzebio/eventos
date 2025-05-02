<template>
    <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="9" :lg="7" :xl="6">
            <CCard class="mx-4">
              <CCardBody class="p-4">
                <CForm>
                  <h1>{{ $t('forgot.title') }}</h1>
                  <p class="text-body-secondary">{{ $t('forgot.subtitle') }}</p>
  
                  <CAlert v-if="successMessage" color="success" dismissible>
                    {{ successMessage }}
                  </CAlert>
                  <CAlert v-if="errorMessage" color="danger" dismissible>
                    {{ errorMessage }}
                  </CAlert>
  
                  <CInputGroup class="mb-4">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      :placeholder="$t('forgot.email')"
                      v-model="email"
                      autocomplete="email"
                    />
                  </CInputGroup>
  
                  <div class="d-grid">
                    <CButton color="primary" @click="handleForgotPassword" :disabled="loading">
                      {{ $t('forgot.btnSendResetLink') }}
                    </CButton>
                    <CButton color="link" class="mt-3" @click="goToLogin">
                      {{ $t('forgot.lnkBackToLogin') }}
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

  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import api from '@/services/api'
    
  const email = ref('')
  const errorMessage = ref('')
  const successMessage = ref('')
  const loading = ref(false)
  const router = useRouter()
  const { t, locale } = useI18n()

  // Aplica o idioma salvo ao carregar a página
  onMounted(() => {
    const savedLang = localStorage.getItem('lang')
    // console.log('Saved language:', savedLang)
    if (savedLang) {
      locale.value = savedLang
    }
  })  
  
  const goToLogin = () => {
    router.push('/pages/loginsystem') // ajuste conforme sua rota
  }
  
  const handleForgotPassword = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    loading.value = true
  
    try {
      const response = await api.post('/auth/forgotpassword', {
        email: email.value,
      })
  
      if (response.status === 200) {
        successMessage.value = response.data.message || 'Reset link sent! Please check your email.'
      } else {
        errorMessage.value = 'Unexpected response from server.'
      }
    } catch (error) {
      if (error.response?.data?.message) {
        errorMessage.value = error.response.status + ' - ' + error.response.data.message
      } else {
        errorMessage.value = 'An error occurred. Please try again.'
      }
    } finally {
      loading.value = false
    }
  }

  </script>
  