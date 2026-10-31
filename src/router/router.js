// src/router/router.js

import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routeList'
import { isAuthenticated, isTokenExpired, logout } from '@/services/authService'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
   history: createWebHashHistory(import.meta.env.BASE_URL),
   routes,
   scrollBehavior() {
      // always scroll to top
      return { top: 0 }
   },
})

// Bloqueia acesso se não estiver logado
router.beforeEach((to, from, next) => {
   const publicPaths = [
      '/pages/login',
      '/pages/loginsystem',
      '/pages/register',
      '/pages/forgotpassword',
      '/pages/resetpassword',
      '/pages/accept-invite',
   ]

   // Checa se a rota atual é pública
   const isPublic = publicPaths.some((path) => to.path.startsWith(path))
   const requiresAuth = !isPublic

   // Redireciona usuários autenticados tentando acessar login
   if (
      isAuthenticated() &&
      (to.path === '/pages/login' || to.path === '/pages/login')
   ) {
      return next('/dashboard')
   }

   // Se precisa de auth e não está logado ou token expirou, faz logout e redireciona
   if (requiresAuth && (!isAuthenticated() || isTokenExpired())) {
      logout()
      return next({ path: '/pages/login', replace: true }) // <- Evita deixar no histórico
   }

   // Valida perfil exigido pela rota (ex.: /admin/*)
   if (to.meta.requiredProfile) {
      const userStore = useUserStore();
      if (!userStore.roles?.includes(to.meta.requiredProfile)) {
         return next({ path: '/dashboard', replace: true });
      }
   }

   next()
})

export default router