import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

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
            'https://acl4.fazcomphp.com.br/api/auth/login',
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password, systemId: 1 }),
            }
         );

         if (!res.ok) throw new Error('Credenciais inválidas.');

         const data = await res.json();
         this.token = data.token;
         localStorage.setItem('token', this.token);
         this.user = jwtDecode(data.token);

         // Armazena o token na sessionStorage
         // this.isAuthenticated = true
         // sessionStorage.setItem('token', this.token)
      },
      async logout() {
         this.token = null;
         this.user = null;
         const response = await api.get(
            'https://acl4.fazcomphp.com.br/api/auth/logout'
         );
         localStorage.removeItem('token');
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
