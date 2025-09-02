import { ref, computed, watch } from 'vue';
import $ from 'jquery';
import 'datatables.net-dt';
import api from '@/services/api';
import { createTooltip } from 'floating-vue';
import { useCurrentEventStore } from '@/stores/currentEvent'
const eventStore = useCurrentEventStore()

export function useDataTable({
   tableId,
   endpoint,
   columns,
   order,
   onClickEdit,
   onClickDelete,
   onClickShow,
   onClickExtraAction,
   externalFilters,
   refreshTable,
}) {
   const dataTable = ref(null);

   // computed() para ser reativo com o Pinia
   const globalEventoId = computed(() => eventStore.currentEvent?.id || '');
   // console.log('order:', order)

   function init() {
      if (dataTable.value) {
         dataTable.value.destroy();
         $(`#${tableId}`).empty();
      }

      dataTable.value = $(`#${tableId}`).DataTable({
         ajax: function (_data, callback, _settings) {

            // acrescenta os filtros do CRUD na consulta
            const filters = {
               ...externalFilters.value,
               // acrescenta o filtro pelo evento_id, sobrescrito aqui e está sempre presente por imposaição da regra do negócio
               evento_id: globalEventoId.value,
             };

            api.get(endpoint, {
               params: filters,
            })
            .then((response) => { 
               // Entrega os dados ao DataTables
               callback({ data: response.data });
            }) 
            .catch((error) => {
               // Verifica se o erro foi 401 Unauthorized
               if (error.response && error.response.status === 401) {
                  // Exemplo: remove token, redireciona para login
                  localStorage.removeItem('token'); // ou conforme você usa
                  window.location.href = '/login'; // ou: router.push('/login')
               } else {
                  // Outro erro qualquer
                  // console.error('Erro ao carregar dados da tabela:', error);
               }

               // console.error('DataTables NÃO conseguiu carregar os dados. Verifique o erro na requisição GET anterior');
               callback({ data: [] }); // evita que a tabela quebre
            });
         },
         columns,
         responsive: true,
         processing: false,         // default para não chamar a ampulheta do DataTables
         order: order || [],        // default é sem ordenação []
         rowId: 'id',               // default é o DT_Row ser a coluna ID
         // dataSrc: '',
         dataSrc: function (response) {
            return response.data;
         }, // Ajuste para o formato esperado pelo DataTables
         // language: { url: '/assets/DataTables.pt_BR.json' },
         language: {
            url: '/assets/DataTables.pt_BR.json', // continua usando tradução geral
               paginate: {
                     first: `
                     <span class="d-none d-sm-inline">Primeiro</span>
                     <i class="fa fa-fast-backward d-inline d-sm-none"></i>`,   // ícone para "Primeiro"
                     previous: `
                     <span class="d-none d-sm-inline">Anterior</span>
                     <i class="fa fa-chevron-left d-inline d-sm-none"></i>`,   // ícone para "Anterior"
                     next: `
                     <span class="d-none d-sm-inline">Próximo</span>
                     <i class="fa fa-chevron-right d-inline d-sm-none"></i>`,  // ícone para "Próximo"
                     last: `
                     <span class="d-none d-sm-inline">Último</span>
                     <i class="fa fa-fast-forward d-inline d-sm-none"></i>`,   // ícone para "Último"
                  },
         },         
         lengthMenu: [
            [5, 10, 25, 50, 100, -1],
            [5, 10, 25, 50, 100, 'Todos'],
         ],
         pageLength: 10,
         drawCallback() {
            bindTableEvents();

            // Reaplica tooltips após o DataTable ser renderizado
            const tooltipEls = document.querySelectorAll('[data-v-tooltip]');

            tooltipEls.forEach((el) => {
               // Evita reaplicar
               if (!el._tooltipInstance) {
                  const content = el.getAttribute('data-v-tooltip');
                  el._tooltipInstance = createTooltip(el, {
                     content,
                     placement: 'top',
                  });
               }
            });
         },
      });
   }

   // este faz com que a qualquer tempo, se o <select> do Evento for mudado, um reload seja disparado
   watch(globalEventoId, () => {
      refreshTable()
   });

   function refreshTable() {
      if (!dataTable.value) {
         console.warn('DataTable ainda não está inicializado.');
         return;
      }
      dataTable.value?.ajax?.reload(null, false);
   }

   function bindTableEvents() {
      const table = $(`#${tableId}`);

      table.off('click', '.btnEdit');
      table.off('click', '.btnDelete');
      table.off('click', '.btnShow');

      table.on('click', '.btnEdit', (e) => {
         const id = $(e.currentTarget).data('id');
         // console.log('Editar Endpoint :', endpoint);
         if (onClickEdit) onClickEdit(id);
      });

      table.on('click', '.btnDelete', (e) => {
         const id = $(e.currentTarget).data('id');
         const rowData = dataTable.value.row(`#${id}`).data();
         // console.log('Linha selecionada para exclusão:', rowData);
         if (onClickDelete) onClickDelete(rowData);
      });

      table.on('click', '.btnShow', (e) => {
         const id = $(e.currentTarget).data('id');
         if (onClickShow) onClickShow(id);
      });

      table.off('click', '[data-custom-action]'); 
      table.on('click', '[data-custom-action]', function (e) {
         e.preventDefault(); // Evita o comportamento padrão do link ou botão

         const id = $(this).closest('tr').attr('id'); // pega o id da linha, se preciso pode pegar o Id do botao
         const row = dataTable.value.row(`#${id}`).data();
         const action = $(e.currentTarget).data('custom-action');
         const dataset = $(e.currentTarget).data();
         const target = $(e.currentTarget); // passa o elemento DOM que disparou o evento
         // console.log(`Base Crud Action [${action}]`, id, dataset, row);

         if (onClickExtraAction) onClickExtraAction(id, action, row, dataset, target);
      });

      // Eventos adicionais para view especializada
      // table.on('click', '.btnSelecionarViagem', (e) => {
      //    const inscricaoId = $(e.currentTarget).data('inscricao_id');
      //    const viagemId = $(e.currentTarget).data('viagem_id');
      //    const rotaId = $(e.currentTarget).data('rota_id');
      //    console.log(`btnSelecionarViagem > InscricaoId ${inscricaoId}; ViagemId ${viagemId}; RotaId ${rotaId}`);
      //    if (onClickSelectViagem) onClickSelectViagem(inscricaoId);
      // });
   }

   return {
      init,
      refreshTable,
      dataTable,
   };
}
