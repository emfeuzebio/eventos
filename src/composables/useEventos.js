// src/composables/useEventos.js
import { ref, onMounted } from 'vue'
import api from '@/services/api'

export function useEventos(ativo = true) {
  const eventos = ref([])
  const rotas = ref([])
  const veiculos = ref([])

  const error = ref(null)

  const fetchEventos = async () => {
    error.value = null

    try {
      const res = await api.get('/evento', {
        params: ativo ? { ativo: 'SIM' } : {},
      })
      eventos.value = res.data
    } catch (err) {
      // console.error('Erro ao carregar a lista de Eventos ativos:', err)
      error.value = err
    }
  }

  const fetchRotas = async () => {
    error.value = null

    try {
      const res = await api.get('/rota', {
        params: ativo ? { ativo: 'Y' } : {},
      })
      // const res = await api.get('/rota')
      rotas.value = res.data
    } catch (err) {
      // console.error('Erro ao carregar a lista de Rotas ativas:', err)
      error.value = err
    }
  }

  const fetchVeiculos = async () => {
    error.value = null

    try {
      const res = await api.get('/veiculo', {
        params: ativo ? { ativo: 'SIM' } : {},
      })
      veiculos.value = res.data
    } catch (err) {
      // console.error('Erro ao carregar a lista de Veículos ativos:', err)
      error.value = err
    }
  }

  // onMounted(fetchEventos)

  return {
    eventos,
    veiculos,
    rotas,
    error,
    fetchEventos, // caso queira recarregar manualmente
    fetchVeiculos,   // caso queira recarregar manualmente
    fetchRotas,   // caso queira recarregar manualmente
  }
}
