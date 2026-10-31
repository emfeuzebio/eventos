import { ref, computed, watch } from 'vue';
import $ from 'jquery';
import 'datatables.net-dt';
import api from '@/services/api';
import { createTooltip } from 'floating-vue';
import { useCurrentEventStore } from '@/stores/currentEvent';

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
   apiInstance = api,        // ← NOVO: instância axios (default: api local)
   includeEventoId = true,   // ← NOVO: injeta evento_id (default: sim)
}) {
   const dataTable = ref(null);
   const eventStore = useCurrentEventStore();

   const globalEventoId = computed(() => eventStore.currentEvent?.id || '');

   function init() {
      if (dataTable.value) {
         dataTable.value.destroy();
         $(`#${tableId}`).empty();
      }

      dataTable.value = $(`#${tableId}`).DataTable({
         ajax: function (_data, callback, _settings) {
            const filters = { ...externalFilters.value };

            // injeta evento_id apenas se includeEventoId = true
            if (includeEventoId) {
               filters.evento_id = globalEventoId.value;
            }

            apiInstance.get(endpoint, { params: filters })
               .then((response) => {
                  callback({ data: response.data });
               })
               .catch((error) => {
                  if (error.response && error.response.status === 401) {
                     localStorage.removeItem('token');
                     window.location.href = '/pages/login';
                  }
                  callback({ data: [] });
               });
         },
         columns,
         responsive: true,
         processing: false,
         order: order || [],
         rowId: 'id',
         dataSrc: function (response) {
            return response.data;
         },
         language: {
            url: '/assets/DataTables.pt_BR.json',
            paginate: {
               first: `<span class="d-none d-sm-inline">Primeiro</span><i class="fa fa-fast-backward d-inline d-sm-none"></i>`,
               previous: `<span class="d-none d-sm-inline">Anterior</span><i class="fa fa-chevron-left d-inline d-sm-none"></i>`,
               next: `<span class="d-none d-sm-inline">Próximo</span><i class="fa fa-chevron-right d-inline d-sm-none"></i>`,
               last: `<span class="d-none d-sm-inline">Último</span><i class="fa fa-fast-forward d-inline d-sm-none"></i>`,
            },
         },
         lengthMenu: [
            [5, 10, 25, 50, 100, -1],
            [5, 10, 25, 50, 100, 'Todos'],
         ],
         pageLength: 10,
         drawCallback() {
            bindTableEvents();

            const tooltipEls = document.querySelectorAll('[data-v-tooltip]');
            tooltipEls.forEach((el) => {
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

   // Só reage ao evento se includeEventoId = true
   if (includeEventoId) {
      watch(globalEventoId, () => {
         refreshTable();
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
         if (onClickDelete) onClickDelete(rowData);
      });

      table.on('click', '.btnShow', (e) => {
         const id = $(e.currentTarget).data('id');
         if (onClickShow) onClickShow(id);
      });

      table.off('click', '[data-custom-action]');
      table.on('click', '[data-custom-action]', function (e) {
         e.preventDefault();
         const id = $(this).closest('tr').attr('id');
         const row = dataTable.value.row(`#${id}`).data();
         const action = $(e.currentTarget).data('custom-action');
         const dataset = $(e.currentTarget).data();
         const target = $(e.currentTarget);
         if (onClickExtraAction) onClickExtraAction(id, action, row, dataset, target);
      });
   }

   return {
      init,
      refreshTable,
      dataTable,
   };
}