<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>

                  <CAlert v-if="errorMessage" color="danger" dismissible>
                    {{ errorMessage }}
                  </CAlert>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autocomplete="username"
                      v-model="username"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" @click="handleLogin" :disabled="loading"> Login </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0" @click="goToForgotPassword">Forgot password?</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3" @click="goToRegister">
                    Register Now!
                  </CButton>                  
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { setToken } from '@/services/authService'
import { useUserStore } from '@/stores/userStore'

const username = ref('')
const password = ref('')
const systemId = ref('')
const errorMessage = ref('')

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)

const goToRegister = () => {
  router.push('/pages/register') // ou o nome da rota que você definiu
}

const goToForgotPassword = () => {
  router.push('/pages/forgotpassword') // ou o nome da rota que você definiu
}

const handleLogin = async () => {

  errorMessage.value = '' // limpa erro antes
  loading.value = true
  error.value = null
  try {
    const response = await api.post('/auth/login', {
      email: username.value,
      password: password.value,
      systemId: 1
    })
    setToken(response.data.token)

    // carregar os dados do token dentro do Pinia userStore
    userStore.loadFromToken()

    router.push('/dashboard')
  } catch (error) {
      errorMessage.value = error.response.status + ' - ' + error.response.data.error
  } finally {
    loading.value = false
  }
}

</script>
