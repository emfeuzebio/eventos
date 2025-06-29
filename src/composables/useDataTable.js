import { ref } from 'vue';
import $ from 'jquery';
import 'datatables.net-dt';
import api from '@/services/api';
import { createTooltip } from 'floating-vue';

export function useDataTable({
   tableId,
   endpoint,
   columns,
   onClickEdit,
   onClickDelete,
   onClickShow,
   onClickExtraAction,
   externalFilters,
   refreshTable,
}) {
   const dataTable = ref(null);

   function init() {
      if (dataTable.value) {
         dataTable.value.destroy();
         $(`#${tableId}`).empty();
      }

      dataTable.value = $(`#${tableId}`).DataTable({
         ajax: function (_data, callback, _settings) {
            api.get(endpoint, {
               params: {
                  ...externalFilters.value,
               },
            })
               .then((response) => callback({ data: response.data })) // Entrega os dados ao DataTables
               .catch((error) => {
                  console.error('Erro ao carregar dados:', error);
                  callback({ data: [] }); // evita que a tabela quebre
               });
         },
         columns,
         responsive: true,
         processing: false,
         rowId: 'id',
         // dataSrc: '',
         dataSrc: function (response) {
            return response.data;
         }, // Ajuste para o formato esperado pelo DataTables
         language: { url: '/assets/DataTables.pt_BR.json' },
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

      table.on('click', '[data-custom-action]', function (e) {
         e.preventDefault(); // Evita o comportamento padrão do link ou botão

         const id = $(this).closest('tr').attr('id'); // pega o id da linha, se preciso pode pegar o Id do botao
         const row = dataTable.value.row(`#${id}`).data();
         const action = $(e.currentTarget).data('custom-action');
         const dataset = $(e.currentTarget).data();
         // console.log(`Base Crud Action [${action}]`, id, dataset, row);

         if (onClickExtraAction) onClickExtraAction(id, action, row, dataset);
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
