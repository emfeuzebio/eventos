// src/composables/useServicosInscricao.js
import { ref } from 'vue'
import api from '@/services/api'

export function useServicosInscricao() {
  const servicosOfertados = ref([])   // serviços que o evento oferece (eve_servicos)
  const servicosDaInscricao = ref([])   // serviços já salvos da inscrição (eve_inscricao_servicos)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Buscar serviços oferecidos pelo evento
   * @param {number} eventoId 
   */
  const fetchServicosOfertados = async (eventoId) => {
    if (!eventoId) {
      servicosOfertados.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get('/evento-servicos-ofertados', {
        params: { evento_id: eventoId }
      })
      servicosOfertados.value = response.data || []
    } catch (err) {
      console.error('Erro ao buscar serviços oferecidos:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar serviços já salvos da inscrição
   * @param {number} inscricaoId 
   */
  const fetchServicosDaInscricao = async (inscricaoId) => {
    if (!inscricaoId) {
      servicosDaInscricao.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/inscricao-servicos/${inscricaoId}`)
      servicosDaInscricao.value = response.data || []
    } catch (err) {
      console.error('Erro ao buscar serviços da inscrição:', err)
      error.value = err
      servicosDaInscricao.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpar todos os dados
   */
  const clear = () => {
    servicosOfertados.value = []
    servicosDaInscricao.value = []
    error.value = null
  }

  return {
    servicosOfertados,
    servicosDaInscricao,
    loading,
    error,
    fetchServicosOfertados,
    fetchServicosDaInscricao,
    clear,
  }
}