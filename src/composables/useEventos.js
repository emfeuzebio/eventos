// src/composables/useEventos.js
import { ref, onMounted } from 'vue';
import api from '@/services/api';

import { useEventosStore } from '@/stores/useEventosStore'
import { storeToRefs } from 'pinia'

// import { useCurrentEventStore } from '@/stores/currentEvent'
// const { globalEventoId } = storeToRefs(useCurrentEventStore());


export function useEventos(ativo = true) {
   const eventos = ref([]);
   const servicosDoEvento = ref([]);
   const todosEventos = ref([]);
   const eventosStore = useEventosStore();
   const rotas = ref([]);
   const veiculos = ref([]);
   const estados = ref([]);
   const regioes = ref([]);
   const viagens = ref([]);
   const organizacoes = ref([]);
   const inscricoes = ref([]);
   const inscricao = ref([]);
   const entidades = ref([]);
   const funcoes = ref([]);
   const pessoas = ref([]);
   const quartosDoHotel = ref([]);
   const quartoTipos = ref([]);
   const viagensDaRota = ref([]);
   const error = ref(null);

   // const fetchEventos = async () => {
   //    try {
   //       error.value = null;
   //       eventos.value = (await api.get('/evento', {
   //          params: ativo ? { ativo: 'SIM' } : {},
   //       })).data;

   //       // ordenando após o response
   //       // eventos.value.sort((a, b) => a.nomeEvento.localeCompare(b.nomeEvento));
   //       // eventos.value.sort((a, b) => new Date(a.inscricao_data_ini) - new Date(b.inscricao_data_ini));  // Date Crescente (a,b)
   //       eventos.value.sort((a, b) => new Date(b.inscricao_data_ini) - new Date(a.inscricao_data_ini));  // Date DeCrescente (b,a)
         
   //    } catch (err) {
   //       error.value = err;
   //    }
   // };

   const fetchtodosEventos = async () => {
      try {
         error.value = null;
         todosEventos.value = (await api.get('/evento')).data;
         todosEventos.value.sort((a, b) => new Date(b.inscricao_data_ini) - new Date(a.inscricao_data_ini));  // Date DeCrescente (b,a)
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

   const fetchRotas = async (eventoId) => {
      try {
         error.value = null;
         const res = await api.get('/rota', {
            params: ativo ? { ativo: 'SIM', evento_id: eventoId } : {},
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
            params: ativo ? { ativo: 'Y' } : {},
         });
         veiculos.value = res.data;
      } catch (err) {
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
      // console.log('fetchViagensDaRota:', rotaId);
      
      try {
         error.value = null;
         insviagensDaRota.value = (await api.get('/viagem'), { params: { rotaId: rotaId } }).data;
      } catch (err) {
         error.value = err;
      }
    }   

   const fetchOrganizacoes = async () => {
      try {
         error.value = null;
         organizacoes.value = (await api.get('/organizacao', {
            params: ativo ? { ativo: 'SIM' } : {}
         })).data;
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
         // console.error(`Erro ao carregar a lista de Inscrições Ativas do Evento ${eventoId}:`, err)
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
         // console.error(`Erro ao carregar a lista de Entidades Ativas:`, err)
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
         // console.error(`Erro ao carregar a lista de Funções/Papeis Ativos:`, err)
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
         // console.error(`Erro ao carregar a lista de Pessoas Ativos:`, err)
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
         // console.error(`Erro ao carregar a Inscrição Ativas ID ${inscricaoId}:`, err)
         error.value = err;
      }
   };

   const fetchQuartosDoHotel = async (eventoId, hotelId) => {
      // console.log('fetchQuartosDoHotel:', eventoId, hotelId);

      try {
         error.value = null;
         quartosDoHotel.value = (await api.get('/quarto', { params: { evento_id: eventoId, hotel_id: hotelId } })).data;
      } catch (err) {
         error.value = err;
      }
    }   

   const fetchQuartoTipos = async () => {
      // console.log('fetchquartoTipos:', eventoId, hotelId);

      try {
         error.value = null;
         quartoTipos.value = (await api.get('/quartotipo', { params: { ativo: 'SIM' } })).data;
      } catch (err) {
         error.value = err;
      }
    }   

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

   const marcarHotelCheckin = async (id, dados) => {
      try {
         error.value = null;
         await api.put(`/inscricao/marcarcheckin/${id}`, dados);
         return true;
      } catch (err) {
         error.value = err;
         return false;
      }
   };

   const marcarHotelCheckout = async (id, dados) => {
      try {
         error.value = null;
         await api.put(`/inscricao/marcarcheckout/${id}`, dados);
         return true;
      } catch (err) {
         error.value = err;
         return false;
      }
   };

   const fetchServicosDoEvento = async (eventoId) => {
      console.log('fetchServicosDoEvento:', eventoId);

      try {
         error.value = null;
         servicosDoEvento.value = (await api.get('/servico', { params: { evento_id: eventoId } })).data;
      } catch (err) {
         error.value = err;
      }
    }   


   return {
      eventos,
      todosEventos,
      servicosDoEvento,
      eventosStore,
      veiculos,
      rotas,
      estados,
      regioes,
      viagens,
      inscricoes,
      organizacoes,
      entidades,
      funcoes,
      pessoas,
      viagensDaRota,
      quartosDoHotel,
      quartoTipos,
      inscricao,

      // fetchEventos,
      fetchtodosEventos,
      fetchServicosDoEvento,
      fetchOrganizacoes,   
      fetchEventos: eventosStore.fetchEventosAtivos,
      fetchVeiculos,       
      fetchRotas,    
      fetchEstados,  
      fetchRegioes,  
      fetchViagens,  
      fetchViagensDaRota,  
      fetchInscricoes,  
      fetchEntidades,  
      fetchFuncoes,  
      fetchPessoas,  
      fetchQuartosDoHotel,    // recupera os Quartos do Hotel
      fetchQuartoTipos,

      getInscricao,           // recupera uma Inscrição 

      marcarTrasladoChegada,  // marca a Viagem
      marcarHotelCheckin,
      marcarHotelCheckout,
      error,
   };
}
