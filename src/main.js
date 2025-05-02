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

// app.use(createPinia())
app.use(pinia)
app.use(router)

app.use(i18n)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsComponents', DocsComponents)
app.component('DocsExample', DocsExample)
app.component('DocsIcons', DocsIcons)

app.mount('#app')

// import { useAuthStore } from '@/store/auth'
