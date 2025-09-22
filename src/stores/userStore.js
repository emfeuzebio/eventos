import { defineStore } from 'pinia'
import { decodeToken, getToken } from '@/services/authService'

export const useUserStore = defineStore('user', {

  persist: true, // ou configure como { storage: localStorage, ... }
    
  state: () => ({
    token: null,
    name: null,
    email: null,
    phone: null,
    photo: null,
    systemId: null,
    systems: [],
    roles: [],
    abilities: [],
    profiles: [],
    menus: [],
    userId: null,
    lastUpdate: null  // Adicione um timestamp para controle de atualização
  }),
  actions: {
    loadFromToken() {

            // const decoded = decodeToken()
            // const token = getToken()
            // // console.log('Token decoded:', decoded)

            // if (!decoded || typeof decoded !== 'object') {
            //   console.warn('Token inválido ou ausente.')
            //   return
            // }

      const token = getToken()
      
      if (!token) {
        console.warn('Token ausente.')
        this.clear()
        return
      }        
      
      try {
        const decoded = decodeToken(token)
        
        if (!decoded || typeof decoded !== 'object') {
          console.warn('Token inválido.')
          this.clear()
          return
        }

        // this.token = decoded || null // Não é necessário atribuir o token decodificado, pois já temos o token original
        this.token = token || null
        this.systemId = decoded.system_id || null
        this.systems = decoded.user_systems || []
        this.userId = decoded.user_id || null
        this.name = decoded.user_name
        this.photo = decoded.user_photo || null
        this.phone = decoded.user_phone || null
        this.roles = decoded.user_roles || []
        this.abilities = decoded.user_abilities || []
        this.profiles = decoded.user_profiles || []
        this.menus = decoded.user_menus || []

      } catch (error) {
        console.error('Erro ao decodificar token:', error)
        this.clear()
      }        
    },

    clear() {
      // Limpar todos os estados
      this.token = null
      this.systemId = null
      this.systems = []
      this.userId = null
      this.name = null
      this.photo = null
      this.phone = null
      this.email = null
      this.roles = []
      this.abilities = []
      this.profiles = []
      this.menus = []
      this.lastUpdate = null

      // Remover token do storage
      removeToken()

      // REMOVER COMPLETAMENTE do localStorage - SOLUÇÃO DIRETA
      localStorage.removeItem('user')      

      // Forçar atualização imediata da UI
      this.$patch({})  // Isso força a reactividade do Pinia
    },
  },
  getters: {
    can: (state) => (ability) => {
        if (!ability || typeof ability !== 'string') return false
        return state.abilities.some((item) => item.trim() === ability.trim())
    },    
    // can: (state) => (ability) => state.abilities.includes(ability),

    // Novo getter para verificar se usuário está autenticado
    isAuthenticated: (state) => {
      if (!state.token) return false
      
      try {
        const decoded = decodeToken(state.token)
        // Verificar se o token não expirou
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          return false
        }
        return true
      } catch {
        return false
      }
    }    
  },
})
