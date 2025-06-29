<!-- components/BaseCrudTable.vue -->
<template>
   <CCol :xs="12">
      <CCard class="mb-4">
         <CCardHeader>
            <strong>{{ title }}</strong>
            <small v-if="description">- {{ description }}</small>
         </CCardHeader>
         <CCardBody>
            <!-- Linha dos filtros, mensagens e botões -->
            <div class="row align-items-center">
               <!-- Coluna 1: Filtros -->
               <div class="col-md-8 d-flex flex-wrap align-items-center gap-2">
                  <div class="d-flex flex-wrap gap-21 mb-1">
                     <div
                        v-for="filter in props.filters"
                        :key="filter.field"
                        class="me-2"
                     >
                        Filtrar por:
                        <label class="form-label fw-bold">
                           {{ filter.label }}</label
                        >
                        <!-- {{ filtros }} -->
                        <!-- {{ [filter.field] }} -->
                        <!-- {{ filters[0].options }} -->

                        <select
                           v-if="filter.type === 'select'"
                           v-model="filtros[filter.field]"
                           class="form-select form-select-sm"
                           @change="refreshTable"
                        >
                           <option value="">Todos</option>
                           <option
                              v-for="opt in filter.options"
                              :key="opt.value"
                              :value="opt.value"
                           >
                              {{ opt.label }}
                           </option>
                        </select>

                        <CFormInput
                           v-else-if="filter.type === 'text'"
                           v-model="filtros[filter.field]"
                           type="text"
                           class="form-control-sm"
                           @change="refreshTable"
                        />

                        <!-- Você pode expandir aqui para tipos como date, checkbox etc -->
                     </div>
                  </div>
               </div>

               <!-- Coluna 2: Botões à esquerda -->
               <div class="col-md-4 text-end">
                  <!-- <CButton
                     class="btn btn-sm btn-outline-info me-1"
                     @click="btnImprimir"
                     >Imprimir</CButton
                  > -->
                  <CButton
                     class="btn btn-sm btn-outline-success me-1"
                     v-if="canInsert"
                     @click="form.insertNewModal"
                     >Inserir Novo</CButton
                  >
                  <CButton
                     class="btn btn-sm btn-outline-secondary"
                     @click="refreshTable"
                     >Recarregar
                  </CButton>
               </div>
            </div>

            <!-- linha da Tabela de dados -->
            <div class="table-responsive col-md-12">
               <table
                  ref="table"
                  class="display table table-striped table-bordered table-hover table-sm compact w-100"
               ></table>
               <!-- <table
                  :id="tableId"
                  class="display table table-striped table-bordered table-hover table-sm compact w-100"
               ></table> -->
            </div>
         </CCardBody>
      </CCard>
   </CCol>

   <!-- Modal Confirma Excluir -->
   <CModal
      :visible="showConfirmDelete"
      @close="cancelDelete"
      backdrop="static"
      keyboard="false"
   >
      <CModalHeader>
         <strong>Confirmar Exclusão</strong>
      </CModalHeader>
      <CModalBody>
         Tem certeza que deseja excluir:
         <strong>{{
            itemToDelete?.pessoa.nome_completo || 'este item'
         }}</strong>
         ?
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-sm btn-outline-secondary me-1"
            @click="cancelDelete"
            >Cancelar</CButton
         >
         <CButton
            color="btn btn-sm btn-outline-danger    me-1"
            @click="confirmDelete"
            >Excluir</CButton
         >
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { onMounted, watch, ref, onUnmounted } from 'vue';
import {
   CModal,
   CModalHeader,
   CModalBody,
   CModalFooter,
   CButton,
} from '@coreui/vue';
import $ from 'jquery';
import 'datatables.net-dt';
// import 'datatables.net-bs5';
import api from '@/services/api';
import { useToast } from '@/composables/useToast';
import { color } from 'chart.js/helpers';

const props = defineProps({
   title: String,
   description: String,
   endpoint: String,
   abilities: {
      type: Array,
      default: () => [],
   },
   columns: Array,
   filters: {
      type: Object,
      default: () => ({}),
   },
   extraColumnRender: Function,
});

// console.log('Props visíveis:', JSON.parse(JSON.stringify(props)));
console.log('Props abilities:', JSON.parse(JSON.stringify(props.abilities)));
// console.log('Props filters:', JSON.parse(JSON.stringify(props.filters)));

const emit = defineEmits(['edit', 'delete', 'custom']);

const { showToast } = useToast();

const table = ref(null);
let dataTableInstance = ref(null);

const initTable = () => {
   dataTableInstance = $(table.value).DataTable({
      ajax: function (_data, callback, _settings) {
         api.get(props.endpoint, {
            params: {
               // ...externalFilters.value,
            },
         })
            .then((response) => callback({ data: response.data })) // Entrega os dados ao DataTables
            .catch((error) => {
               // console.error('Erro ao carregar dados:', error);
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
            width: '250px',
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
      // console.log('Base Crud Edit', row);
      const getData = async () => await loadDataFormModal(row.id);
      emit('edit', row, getData);
   });

   $(table.value).on('click', '.btn-delete', function () {
      const row = dataTableInstance.row($(this).closest('tr')).data();
      console.log('Base Crud Excluir', row);
      openDeleteModal(row);
      // emit('delete', row);
   });

   $(table.value).on('click', '[data-custom-action]', function (e) {
      const row = dataTableInstance.row($(this).closest('tr')).data();
      const action = this.dataset.customAction; // NÃO use $(this).data()
      const dataset = { ...this.dataset }; // aqui copia todos os data-*
      console.log(`Base Crud Action [${action}]`, row);

      emit('custom', {
         row,
         action,
         dataset,
         target: this, // passa o elemento DOM que disparou o evento
      });
   });
};

function refreshTable() {
   if (!dataTableInstance) {
      console.warn('DataTable ainda não está inicializado.');
      return;
   }
   dataTableInstance?.ajax?.reload(null, false);
}

function btnImprimir() {
   showToast({
      title: 'Alerta',
      message: 'Imprimir não implementado ainda!',
      color: 'danger',
   });
}

const showConfirmDelete = ref(false);
const itemToDelete = ref(null);

function openDeleteModal(row) {
   itemToDelete.value = row;
   showConfirmDelete.value = true;
}

function cancelDelete() {
   showConfirmDelete.value = false;
   itemToDelete.value = null;
}

const loadDataFormModal = async (id = 0) => {
   const endpoint = props.endpoint;
   // console.log('loadDataFormModal: ', endpoint, id);

   try {
      const res = await api.get(`${endpoint}/${id}`);
      // const res = await api
      //    .get(`${endpoint}/${id}`)
      //    .then((response) => response.data);

      // formDataModal.value = { ...fields, ...res.data }; // carrega os dados do response para o form Modal

      console.log('loadDataFormModal: Dados carregados:', res.data);
      return res.data; // Retorna os dados carregados
   } catch (error) {
      console.error(`Erro ao carregar a Inscrição ID ${id}:`, error);
   }
};

// USADO NO GENERIC CRUD QUANDO O EDIT FORM MODAL COM SLOT ESTÁ NESTE ARQUIVO
// async function load(id = 0) {
//    try {
//       loading.value = true;
//       const res = await api.get(`${endpoint}/${id}`);
//       form.value = { ...fields, ...res.data }; // carrega os dados do response para o form Modal
//       isEditing.value = id ?? false; // controle se é edição ou novo registro
//       formError.value = ''; // limpa o form errors
//       clearFieldErrors(); // limpa o filds errors
//       editModalVisible.value = true; // mostra o modal
//    } catch (err) {
//       formError.value =
//          err.response?.data?.message || 'Erro ao carregar dados';
//    } finally {
//       loading.value = false;
//    }
// }

const confirmDelete = async () => {
   // Usado quando emitia para página Pai o delete event
   // emit('delete', itemToDelete.value);

   try {
      await api.delete(`${props.endpoint}/${itemToDelete.value.id}`);
      showToast({
         title: 'Alerta',
         message: `Registro ${id} excluído com sucesso!`,
      });
      itemToDelete.value = null;
      showConfirmDelete.value = false;
      refreshTable();
   } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // showToast({title: 'Erro', message: `Erro ao excluir o Registro ${id}! ` + error, color: 'danger',});
   }
};

onMounted(() => {
   initTable();
});

onUnmounted(() => {
   if (dataTableInstance) {
      dataTableInstance.destroy();
   }
});

// Expõe a função para componentes pais
defineExpose({
   refreshTable,
   btnImprimir,
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

.form-label {
   margin-bottom: 1px;
   margin-top: 12px;
   font-weight: bold;
}
</style>
