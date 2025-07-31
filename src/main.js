import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import piniaPersist from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from '@/router/router' 
 './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsComponents from '@/components/DocsComponents'
import DocsExample from '@/components/DocsExample'
import DocsIcons from '@/components/DocsIcons'

import CoreUIMultiselect from '@/components/CoreUIMultiselect.vue'

// novo
import { setRouterInstance } from '@/utils/routerHelper'
setRouterInstance(router)


import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import en from './locales/en.json'
import pt from './locales/pt.json'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || 'en',       // default
    fallbackLocale: 'en',
    messages: {
        en,
        pt
    }
})

app.use(pinia)                  // Pinia para gerenciamento de estado
app.use(router)                 // Vue Router para navegação
app.use(FloatingVue);           // Para tooltips e popovers

app.use(i18n)                   // Vue I18n para internacionalização
app.use(CoreuiVue)              // CoreUI Vue para componentes UI
app.provide('icons', icons)     // Fornece os ícones para os componentes
app.component('CIcon', CIcon)
app.component('DocsComponents', DocsComponents)
app.component('DocsExample', DocsExample)
app.component('DocsIcons', DocsIcons)

// Registro global
app.component('CoreUIMultiselect', CoreUIMultiselect)   // Select com busca contextual select2 adaptado para CoreUI

app.mount('#app')

// import { useAuthStore } from '@/store/auth'
