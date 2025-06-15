// src/composables/useEventos.js
import { ref, onMounted } from 'vue'
import api from '@/services/api'

export function useEventos(ativo = true) {
  const eventos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchEventos = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await api.get('/evento', {
        params: ativo ? { ativo: 'SIM' } : {},
      })
      eventos.value = res.data
    } catch (err) {
    //   console.error('Erro ao carregar a lista de Eventos ativos:', err)
      console.error('Erro ao carregar a lista de Eventos ativos:')
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchEventos)

  return {
    eventos,
    loading,
    error,
    fetchEventos, // caso queira recarregar manualmente
  }
}
