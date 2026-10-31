// src/main.js

// ===== CSS (ordem importa: CoreUI/Bootstrap → DataTables → FontAwesome → FloatingVue) =====
import '@coreui/coreui/dist/css/coreui.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'floating-vue/dist/style.css';

// ===== Vue e plugins =====
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import piniaPersist from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from '@/router/router'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsComponents from '@/components/DocsComponents'
import DocsExample from '@/components/DocsExample'
import DocsIcons from '@/components/DocsIcons'
import CoreUIMultiselect from '@/components/CoreUIMultiselect.vue'
import FloatingVue from 'floating-vue'

// ===== Locales =====
import en from './locales/en.json'
import pt from './locales/pt.json'

// ===== Router helper =====
import { setRouterInstance } from '@/utils/routerHelper'
setRouterInstance(router)

// ===== App =====
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

const i18n = createI18n({
   legacy: false,
   locale: localStorage.getItem('lang') || 'en',
   fallbackLocale: 'en',
   messages: { en, pt }
})

app.use(pinia)
app.use(router)
app.use(FloatingVue)
app.use(i18n)
app.use(CoreuiVue)

app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsComponents', DocsComponents)
app.component('DocsExample', DocsExample)
app.component('DocsIcons', DocsIcons)
app.component('CoreUIMultiselect', CoreUIMultiselect)

app.mount('#app')