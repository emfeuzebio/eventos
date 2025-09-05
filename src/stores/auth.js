import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { useEventosStore } from './useEventosStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const aclURL = import.meta.env.VITE_API_ACL_URL;   // https://acl4.fazcomphp.com.br/

export const useAuthStore = defineStore('auth', {
   state: () => ({
      token: localStorage.getItem('token') || null,
      user: null,
      // isAuthenticated: false
   }),
   getters: {
      isAuthenticated: (state) => !!state.token,
   },
   actions: {
      async login(email, password) {
         const res = await fetch(
            aclURL + 'api/auth/login',
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password, systemId: 1 }),
            }
         );

         if (!res.ok) throw new Error('Credenciais inválidas.');

         const data = await res.json();
         this.token = data.token;
         localStorage.setItem('token', this.token);   // Armazena o token na sessionStorage
         this.user = jwtDecode(data.token);

         // Carrega eventos no storage após login
         const eventosStore = useEventosStore()
         await eventosStore.fetchEventosAtivos()
      },
      async logout() {

         console.warn('auth.js logout()')

         this.token = null;
         this.user = null;
         const response = await api.get(
            aclURL + 'api/auth/logout'
         );
         localStorage.removeItem('token');
         localStorage.removeItem('user')
         localStorage.removeItem('currentEvent')
         localStorage.removeItem('eventos')

         // sessionStorage.removeItem('token')
         // this.isAuthenticated = false

      },
      loadSession() {
         const token = sessionStorage.getItem('token');
         if (token) {
            this.token = token;
            this.user = jwtDecode(token);
            //   this.isAuthenticated = true
         }
      },
   },
});
