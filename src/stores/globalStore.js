import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    globalMessage: '',
    // globalMessage: 'Esta é um teste de mensagem global.'    
  }),
  actions: {
    setGlobalMessage(msg) {
      this.globalMessage = msg
      setTimeout(() => (this.globalMessage = ''), 10000) // limpa após 10s
    },
  },
})
