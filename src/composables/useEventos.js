// src/composables/useEventos.js
import { ref, onMounted } from 'vue';
import api from '@/services/api';

export function useEventos(ativo = true) {
   const eventos = ref([]);
   const rotas = ref([]);
   const veiculos = ref([]);
   const estados = ref([]);
   const regioes = ref([]);
   const viagens = ref([]);
   const inscricoes = ref([]);
   const inscricao = ref([]);
   const entidades = ref([]);
   const funcoes = ref([]);
   const pessoas = ref([]);
   const viagensDaRota = ref([]);
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

   const fetchRegioes = async () => {
      try {
         error.value = null;
         regioes.value = (await api.get('/regiao')).data;
      } catch (err) {
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

   const fetchViagens = async () => {
      try {
         error.value = null;
         viagens.value = (await api.get('/viagem')).data;
      } catch (err) {
         error.value = err;
      }
   };

   const fetchViagensDaRota = async (rotaId) => {
      console.log('fetchViagensDaRota:', rotaId);
      
      try {
         error.value = null;
         viagensDaRota.value = (await api.get('/viagem'), { params: { rotaId: rotaId } }).data;
      } catch (err) {
         error.value = err;
      }
    }   

   const fetchInscricoes = async (eventoId) => {
      try {
         error.value = null;
           const res = await api.get('/inscricao', {
            params: {
               ativo: 'SIM',
               eventoId: eventoId,
            },
         });
         inscricoes.value = res.data;
      } catch (err) {
         console.error(`Erro ao carregar a lista de Inscrições Ativas do Evento ${eventoId}:`, err)
         error.value = err;
      }
   };

   const fetchEntidades = async () => {
      try {
         error.value = null;
           const res = await api.get('/entidade', {
            params: {
               ativo: 'SIM',
            },
         });
         entidades.value = res.data;
      } catch (err) {
         console.error(`Erro ao carregar a lista de Entidades Ativas:`, err)
         error.value = err;
      }
   };

   const fetchFuncoes = async () => {
      try {
         error.value = null;
           const res = await api.get('/funcao', {
            params: {
               ativo: 'SIM',
            },
         });
         funcoes.value = res.data;
      } catch (err) {
         console.error(`Erro ao carregar a lista de Funções/Papeis Ativos:`, err)
         error.value = err;
      }
   };

   const fetchPessoas = async () => {
      try {
         error.value = null;
           const res = await api.get('/pessoa', {
            params: {
               ativo: 'SIM',
            },
         });
         pessoas.value = res.data;
      } catch (err) {
         console.error(`Erro ao carregar a lista de Pessoas Ativos:`, err)
         error.value = err;
      }
   };

   const getInscricao = async (inscricaoId) => {
      try {
         error.value = null;
           const res = await api.get(`/inscricao/${inscricaoId}`, {
            params: {
               ativo: 'SIM',
            },
         });
         // inscricao.value = res.data;
         return res.data;
      } catch (err) {
         console.error(`Erro ao carregar a Inscrição Ativas ID ${inscricaoId}:`, err)
         error.value = err;
      }
   };


   const marcarTrasladoChegada = async (id, dados) => {
      try {
         error.value = null;
         await api.put(`/inscricao/marcarchegada/${id}`, dados);
         return true;
      } catch (err) {
         error.value = err;
         return false;
      }
   };

   // onMounted(fetchEventos)

   return {
      eventos,
      veiculos,
      rotas,
      estados,
      regioes,
      viagens,
      inscricoes,
      entidades,
      funcoes,
      pessoas,
      viagensDaRota,

      inscricao,
      
      fetchEventos,  // caso queira recarregar manualmente
      fetchVeiculos, // caso queira recarregar manualmente
      fetchRotas,    // caso queira recarregar manualmente
      fetchEstados,  // caso queira recarregar manualmente
      fetchRegioes,  // caso queira recarregar manualmente
      fetchViagens,  // caso queira recarregar manualmente
      fetchViagensDaRota,  // caso queira recarregar manualmente
      fetchInscricoes,  // caso queira recarregar manualmente
      fetchEntidades,  // caso queira recarregar manualmente
      fetchFuncoes,  // caso queira recarregar manualmente
      fetchPessoas,  // caso queira recarregar manualmente

      getInscricao,     // caso queira recarregar manualmente uma inscrição específica

      marcarTrasladoChegada, // 
      error,
   };
}
