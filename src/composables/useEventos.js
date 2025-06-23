// src/composables/useEventos.js
import { ref, onMounted } from 'vue';
import api from '@/services/api';

export function useEventos(ativo = true) {
   const eventos = ref([]);
   const rotas = ref([]);
   const veiculos = ref([]);
   const estados = ref([]);
   const regioes = ref([]);
   const error = ref(null);

   const fetchEventos = async () => {
      try {
         error.value = null;
         const res = await api.get('/evento', {
            params: ativo ? { ativo: 'SIM' } : {},
         });
         eventos.value = res.data;
      } catch (err) {
         error.value = err;
      }
   };

   const fetchRotas = async () => {
      try {
         error.value = null;
         const res = await api.get('/rota', {
            params: ativo ? { ativo: 'Y' } : {},
         });
         rotas.value = res.data;
      } catch (err) {
         error.value = err;
      }
   };

   const fetchVeiculos = async () => {
      try {
         error.value = null;
         const res = await api.get('/veiculo', {
            params: ativo ? { ativo: 'SIM' } : {},
         });
         veiculos.value = res.data;
      } catch (err) {
         // console.error('Erro ao carregar a lista de Veículos ativos:', err)
         error.value = err;
      }
   };

   const fetchEstados = async () => {
      try {
         error.value = null;
         estados.value = (await api.get('/estado')).data;
      } catch (err) {
         error.value = err;
      }
   };

   const fetchRegioes = async () => {
      try {
         error.value = null;
         regioes.value = (await api.get('/regiao')).data;
      } catch (err) {
         error.value = err;
      }
   };

   // onMounted(fetchEventos)

   return {
      eventos,
      veiculos,
      rotas,
      estados,
      regioes,
      fetchEventos, // caso queira recarregar manualmente
      fetchVeiculos, // caso queira recarregar manualmente
      fetchRotas, // caso queira recarregar manualmente
      fetchEstados, // caso queira recarregar manualmente
      fetchRegioes, // caso queira recarregar manualmente
      error,
   };
}
