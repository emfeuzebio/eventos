<template>
    <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <!-- <CCol :md="10"> -->
          <CCol :md="10" :xs="12">

            <CCardGroup class="d-flex flex-md-row flex-column" style="min-height: auto;">

              <!-- Login Form - Full width em mobile -->
              <CCard class="p-4 w-md-50 border-md-end border-1 border-secondary-subtle">
                <CForm>
                    <h1>{{ appName }}</h1>
                    <h2>{{ $t('login.title') }}</h2>
                    <p class="text-body-secondary">{{ $t('login.subtitle') }}</p>
  
                    <CAlert v-if="errorMessage" color="danger" dismissible>
                      {{ errorMessage }}
                    </CAlert>
  
                    <CInputGroup class="mb-3">
                      <CInputGroupText><CIcon icon="cil-user" /></CInputGroupText>
                      <div ref="emailWrapper" style="flex: 1">
                        <CFormInput :placeholder="$t('login.email')" autocomplete="email" v-model="email" ref="emailInput"/>
                      </div>
                    </CInputGroup>
  
                    <CInputGroup class="mb-4">
                      <CInputGroupText><CIcon icon="cil-lock-locked" /></CInputGroupText>
                      <CFormInput type="password" :placeholder="$t('login.password')" autocomplete="current-password" v-model="password" />
                    </CInputGroup>
  
                    <CRow>
                      <CCol :xs="6">
                        <CButton color="primary" class="px-4" @click="handleLogin" :disabled="loading">{{ $t('login.btnLogin') }}</CButton>
                      </CCol>
                      <CCol :xs="6" class="text-right">
                        <CButton color="link" class="px-0" @click="goToForgotPassword">{{ $t('login.forgot') }}</CButton>
                      </CCol>
                    </CRow>
                </CForm>               
                
                <!-- Registro de Novo User -->
                <CCard class="bg-primary text-white mt-2">
                  <CCardBody class="text-center">
                      <h4>{{ $t('login.noAccountTitle') }}</h4>
                      <p>{{ $t('login.noAccountSubtitle') }}</p>
                      <CButton color="light" variant="outline" class="mt-1" @click="goToRegister" :disabled="loading">
                        {{ $t('login.register') }}
                      </CButton>
                  </CCardBody>
                </CCard>                

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

              </CCard>

              <!-- Systems List - Full width em mobile e adicionado margin-top -->
              <CCard class="bg-light w-md-50 mt-md-0 mt-3 overflow-auto">
                
                <!-- ... conteúdo da saudação ... -->
                <CCardBody>
                  <div class="text-center mb-4">
                    <h4 v-if="userStore.name" class="mb-2 systems-greeting" tabindex="-1">{{ $t('systems.greeting') }}, {{ userName }}</h4>
                    <CButton v-if="userStore.name" color="primary" size="sm" @click="logout">{{ $t('logout') }}</CButton>
                    
                    <h5 class="mt-3">{{ $t('systems.title') }}</h5>
                    <p class="text-muted small">{{ $t('systems.subtitle') }}</p>
                  </div>
  
                  <!-- ... conteúdo da lista de sistemas ... -->
                  <!-- <div class="d-flex flex-column gap-3 systems-list" style="max-height: 520px; overflow-y: auto;" v-if="userStore.systems.length"> -->

                  <div class="d-flex flex-column gap-3 systems-list" :class="{'systems-card-mobile': isMobile}" v-if="userStore.systems.length">
                    <CCard v-for="system in systems" :key="system.id" class="shadow-sm">
                      <CCardBody class="d-flex flex-column">
                        <div class="d-flex align-items-center mb-2">
                          <img v-if="system.icon" :src="system.icon" alt="icon" style="width: 32px; height: 32px;" class="me-2" />
                          <strong>{{ system.name }}</strong>
                        </div>
                        <p class="text-muted small">{{ system.description }}</p>
                        <!-- <CButton color="primary" size="sm" @click="goToSystem(system)">Acessar</CButton> -->
                        <CButton color="primary" size="sm" @click="redirectToSystem(system)">Ir Para</CButton>
                      </CCardBody>
                    </CCard>
                  </div>
                </CCardBody>

              </CCard>

            </CCardGroup>            
          </CCol>
        </CRow>
      </CContainer>
    </div>
    <div v-if="loading" class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style="z-index: 1050;">
      <CSpinner color="light" />
    </div>
  </template>
  
  <script setup>

  import { ref, onMounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/services/api'
  import { getToken, setToken, removeToken, decodeToken, getUserNameFromToken, logout as doLogout } from '@/services/authService'
  import { useUserStore } from '@/stores/userStore'
  import { useI18n } from 'vue-i18n'
  
  const appName = import.meta.env.VITE_APP_NAME
  const email = ref('')
  const emailInput = ref(null)
  const userName = ref('')
  const password = ref('')
  const inputWrapper = ref(null)
  const emailWrapper = ref(null)
  const errorMessage = ref('')
  const userStore = useUserStore()
  const router = useRouter()
  const loading = ref(false)
  const systems = ref([])
  const isMobile = ref(false);
  const { locale } = useI18n()

  const changeLocale = (event) => {
    locale.value = event.target.value
    localStorage.setItem('lang', locale.value)
  }

  const focusEmail = async () => {
    await nextTick()
    const input = emailWrapper.value?.querySelector('input')
    input?.focus()
  }
  
  const goToRegister = () => {
    router.push('/pages/register')
  }
  
  const goToForgotPassword = () => {
    router.push('/pages/forgotpassword')
  }

  /**
   * FASE 1 do Login - Autenticação e recebimento do token e da lista de Systems sem abilities
   */ 
  const handleLogin = async () => {   
    errorMessage.value = ''
    loading.value = true

    try {
      const response = await api.post('/auth/login', {
        email: email.value,
        password: password.value,
      })
  
      setToken(response.data.token)
      userStore.loadFromToken()

      const decoded = decodeToken()
      // console.log('Decoded token:', decoded)
  
      systems.value = decoded?.user_systems || []
      userName.value = getUserNameFromToken()

        // Adicionar timeout para garantir que a renderização esteja completa
        setTimeout(() => {
          // Mover o foco para a saudação ou primeiro sistema
          const greetingElement = document.querySelector('.systems-greeting');
          if (greetingElement) {
            greetingElement.scrollIntoView({ behavior: 'smooth' });
            greetingElement.focus();
          }
        }, 100);      
  
    } catch (error) {
        errorMessage.value = error.response?.status + ' - ' + (error.response?.data?.error || 'Erro ao logar.')
    } finally {
        loading.value = false
    }
  }

  /**
   * FASE 2 do Login no System 
   *  Obtem novo Token para o System informado
   *  Redireciona para o sistema externo e envia o token JWT com as abilities do System
   *  O sistema externo deve validar o token e redirecionar para a tela correta
   */
   const redirectToSystem = async (system) => {
    try {
      loading.value = true;
      errorMessage.value = '';

      // 1. Obter novo token específico do sistema
      const response = await api.post('/auth/selectSystem', {
        systemId: system.id
      });

      // 2. Atualizar armazenamento local
      removeToken();
      setToken(response.data.newToken);
      userStore.loadFromToken();

      // 3. Preparar URL com token
      const token = getToken();
      const redirectUrl = new URL(system.url);
      redirectUrl.searchParams.append('token', token);

      redirectWithPost(system.url, token);

            // // 4. Redirecionamento profissional
            // if (system.openInNewTab) {
            //   // Abre em nova aba de forma controlada
            //   const newWindow = window.open('', '_blank');
            //   if (newWindow) {
            //     newWindow.location.href = redirectUrl.toString();
            //   } else {
            //     // Fallback para usuários com bloqueio de pop-ups
            //     window.location.href = redirectUrl.toString();
            //   }
            // } else {
            //   // Redirecionamento na mesma janela
            //   window.location.href = redirectUrl.toString();
            // }

    } catch (error) {
      errorMessage.value = error.response?.status + ' - ' + 
        (error.response?.data?.error || 'Erro ao selecionar o sistema');
      console.error('Redirect error:', error);
    } finally {
      loading.value = false;
    }
  };

  const redirectWithPost = (url, token) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token';
    input.value = token;
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };  

  const logout = async () => {
    doLogout()  // sua função do authService.js

    // Limpa os campos
    email.value = null
    password.value = null
    systems.value = []

    // foca no campo email
    focusEmail()

    router.push('/pages/login')
  }  
  
  onMounted(() => {

    isMobile.value = window.innerWidth < 768;

    // Foca no campo email
    nextTick(() => {
      const input = inputWrapper.value?.querySelector('input')
      input?.focus()
    })    

    // Se já tem token válido, extrai systems
    const decoded = decodeToken()
    if (decoded?.user_systems) {
      systems.value = decoded.user_systems
      // console.log('Decoded token:', decoded)
    } else {
      userStore.clear()
      // Limpa os campos
      email.value = null
      password.value = null
      systems.value = [] // Limpa a lista de sistemas

      // foca no campo email
      focusEmail()
    }
  })
  
  </script>
  
  <style scoped>

    /* Estiliza a barra de rolagem se quiser */
    ::-webkit-scrollbar {
        width: 6px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #cfcfcf;
        border-radius: 10px;
    }

    @media (max-width: 768px) {
    .wrapper {
      padding: 20px 0;
    }
    
    .systems-card {
      max-height: none !important;
      overflow-y: visible !important;
    }
    
    .login-card {
      border-right: none !important;
      border-bottom: 1px solid #dee2e6;
    }
  }    

  </style>


  