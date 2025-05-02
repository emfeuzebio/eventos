import { defineStore } from 'pinia'
import { decodeToken, getToken } from '@/services/authService'

export const useUserStore = defineStore('user', {

  persist: true, // ou configure como { storage: localStorage, ... }
    
  state: () => ({
    token: null,
    name: null,
    photo: null,
    systemId: null,
    systems: [],
    roles: [],
    abilities: [],
    profiles: [],
    userId: null
  }),
  actions: {
    loadFromToken() {
      const decoded = decodeToken()
      const token = getToken()
      // console.log('Token decoded:', decoded)

      if (!decoded || typeof decoded !== 'object') {
        console.warn('Token inválido ou ausente.')
        return
      }

      // this.token = decoded || null // Não é necessário atribuir o token decodificado, pois já temos o token original
      this.token = token || null
      this.systemId = decoded.systemId || null
      this.systems = decoded.user_systems || []
      this.userId = decoded.user_id || null
      this.name = decoded.user_name
      this.photo = decoded.user_photo || null
      this.roles = decoded.user_roles || []
      this.abilities = decoded.user_abilities || []
      this.profiles = decoded.user_profiles || []
    },
    clear() {
      this.token = null
      this.systemId = null
      this.systems = []
      this.userId = null
      this.name = null
      this.photo = null
      this.roles = []
      this.abilities = []
      this.profiles = []
    },
  },
  getters: {
    can: (state) => (ability) => {
        if (!ability || typeof ability !== 'string') return false
        return state.abilities.some((item) => item.trim() === ability.trim())
    },    
    // can: (state) => (ability) => state.abilities.includes(ability),
  },
})
