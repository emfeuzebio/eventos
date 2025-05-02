<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const token = ref(route.query.token || '')
const email = ref(route.query.email || '')

const password = ref('')
const password_confirmation = ref('')

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const goToLogin = () => {
  router.push('/pages/login') // ou { name: 'Login' } se estiver usando name
}

const handleReset = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  if (!email.value || !token.value) {
    errorMessage.value = 'E-Mail não capturado.'
    loading.value = false
    return
  }

  if (!token.value) {
    errorMessage.value = 'Token não capturado.'
    loading.value = false
    return
  }

  if (!password.value || !password_confirmation.value) {
    errorMessage.value = 'Preencha todos os campos.'
    loading.value = false
    return
  }

  if (password.value !== password_confirmation.value) {
    errorMessage.value = 'As senhas não coincidem.'
    loading.value = false
    return
  }

  try {
    const response = await api.post('/auth/resetPassword', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    })

    successMessage.value = response.data.message || 'Senha redefinida com sucesso!'
    setTimeout(() => {
        this.$router.push('/pages/login')
    }, 2000)

  } catch (error) {
    // errorMessage.value = error.response?.data?.message || 'Erro ao redefinir a senha.'
    errorMessage.value = error.response.status + ' - ' + error.response.data.message || 'Erro ao redefinir a senha.'
  } finally {
    loading.value = false
  }
}

/*
// http://localhost:3000/#/pages/resetpassword/?token=j5kwlJMts3JziUKzjaY0Qw657tZpkQHy55YBFDCcKKEjk0aMaWgrfTVyc8p3j2YY&email=emfeuzebio72%40gmail.com
*/

</script>


<template>
    <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="9" :lg="7" :xl="6">
            <CCard class="mx-4">
              <CCardBody class="p-4">
                <CForm>
                  <h1>Reset Password</h1>
                  <p class="text-body-secondary">Reset your Password after request</p>
  
                  <CAlert v-if="errorMessage" color="danger" dismissible> 
                    {{ errorMessage }}
                  </CAlert>

                  <CAlert v-if="successMessage" color="success" dismissible> 
                    {{ successMessage }}
                  </CAlert>                  
                  
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
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
                      placeholder="Repeat password"
                      autocomplete="new-password"
                      v-model="password_confirmation"
                    />
                  </CInputGroup>
                  <div class="d-grid">
                    <CButton color="primary" @click="handleReset" :disabled="loading">Reset Password</CButton>
                    <CButton color="link" class="mt-3" @click="goToLogin">Already have an account? Login</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
</template>

