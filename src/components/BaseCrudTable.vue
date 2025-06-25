<!-- components/BaseCrudTable.vue -->
<template>
   <table ref="table" class="table table-striped" style="width: 100%"></table>
</template>

<script setup>
import { onMounted, watch, ref, onUnmounted } from 'vue';
import $ from 'jquery';
import 'datatables.net-dt';
// import 'datatables.net-bs5';
import api from '@/services/api';

const props = defineProps({
   columns: Array,
   ajaxUrl: String,
   externalFilters: {
      type: Object,
      default: () => ({}),
   },
   extraColumnRender: Function,
});

const emit = defineEmits(['edit', 'delete', 'custom']);

const table = ref(null);
let dataTableInstance = null;

const initTable = () => {
   dataTableInstance = $(table.value).DataTable({
      ajax: function (_data, callback, _settings) {
         api.get(props.ajaxUrl, {
            params: {
               // ...externalFilters.value,
            },
         })
            .then((response) => callback({ data: response.data })) // Entrega os dados ao DataTables
            .catch((error) => {
               console.error('Erro ao carregar dados:', error);
               callback({ data: [] }); // evita que a tabela quebre
            });
      },
      responsive: true,
      processing: false,
      autoWidth: false,
      rowId: 'id',
      language: { url: '/assets/DataTables.pt_BR.json' },
      lengthMenu: [
         [5, 10, 25, 50, 100, -1],
         [5, 10, 25, 50, 100, 'Todos'],
      ],
      pageLength: 10,
      columns: [
         ...props.columns,
         {
            title: 'Ações',
            data: null,
            orderable: false,
            render: (data, type, row) => {
               let html = `
                    <button class="btn btn-xs btn-outline-primary me-1 btn-edit">Editar</button>
                    <button class="btn btn-xs btn-outline-danger  me-1 btn-delete">Excluir</button>
                `;
               if (props.extraColumnRender) {
                  html += props.extraColumnRender(row);
               }
               return html;
            },
         },
      ],
      destroy: true,
   });

   $(table.value).on('click', '.btn-edit', function () {
      const row = dataTableInstance.row($(this).closest('tr')).data();
      emit('edit', row);
   });

   $(table.value).on('click', '.btn-delete', function () {
      const row = dataTableInstance.row($(this).closest('tr')).data();
      emit('delete', row);
   });

   //    $(table.value).on('click', '[data-custom-action]', function () {
   //       const row = dataTableInstance.row($(this).closest('tr')).data();
   //       const action = $(this).data('custom-action');
   //       emit('custom', { row, action });
   //    });

   // Escuta eventos de ações personalizadas - FUNCIONADO
   //    $(table.value).on('click change', '[data-custom-action]', function (e) {
   //       const row = dataTableInstance.row($(this).closest('tr')).data();
   //       const action = $(this).data('custom-action');

   //       let value;

   //       if ($(this).is(':checkbox')) {
   //          value = $(this).prop('checked') ? 'SIM' : 'NÃO';
   //       } else {
   //          value = $(this).val(); // para botões ou inputs normais
   //       }

   //       emit('custom', { row, action, value });
   //    });

   $(table.value).on('click', '[data-custom-action]', function (e) {
      const row = dataTableInstance.row($(this).closest('tr')).data();
      const action = this.dataset.customAction; // NÃO use $(this).data()
      const dataset = { ...this.dataset }; // aqui copia todos os data-*

      emit('custom', {
         row,
         action,
         dataset,
         target: this, // passa o elemento DOM que disparou o evento
      });
   });
};

onMounted(() => {
   initTable();
});

onUnmounted(() => {
   if (dataTableInstance) {
      dataTableInstance.destroy();
   }
});
</script>

<style>
@import 'datatables.net-dt/css/dataTables.dataTables.min.css';

.btn-xs {
   padding: 0.15rem 0.4rem;
   font-size: 0.75rem;
   line-height: 1;
   border-radius: 0.2rem;
}

.form-error {
   color: #dc3545;
   font-size: 0.875rem;
   margin-top: 0.25rem;
}

.dataTable tbody td {
   font-size: 15px;
   /* font-weight: bold; */
   /* font-size: medium; */
}
</style>
