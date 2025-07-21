// store/useEventosStore.js
import { defineStore } from 'pinia'
import api from '@/services/api';

export const useEventosStore = defineStore('eventos', {
  state: () => ({
    ativos: [],
    error: null,
  }),

  actions: {
    async fetchEventosAtivos() {
      try {
        this.error = null
        const response = await api.get('/evento', { params: { ativo: 'SIM' } })
        const eventosOrdenados = response.data.sort(
          (a, b) => new Date(b.inscricao_data_ini) - new Date(a.inscricao_data_ini)
        )
        this.ativos = eventosOrdenados
      } catch (err) {
        this.error = err
      }
    },

    atualizarEvento(eventoAtualizado) {
      const index = this.ativos.findIndex(e => e.id === eventoAtualizado.id)
      if (eventoAtualizado.ativo === 'SIM') {
        if (index !== -1) {
          this.ativos[index] = eventoAtualizado
        } else {
          this.ativos.push(eventoAtualizado)
        }
      } else {
        this.ativos = this.ativos.filter(e => e.id !== eventoAtualizado.id)
      }
    }
  },

  persist: true
})
