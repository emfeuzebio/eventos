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
               <div class="col-md-6 d-flex flex-wrap align-items-center gap-2">
                  <div class="d-flex flex-wrap gap-21 mb-1">
                     <div
                        v-for="filter in props.filters"
                        :key="filter.field"
                        class="me-2"
                     >
                        <!-- Filtrar por: -->
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

               <!-- Coluna 3: Botões -->
               <div class="col-md-6 text-end">
                  <span v-for="buttom in props.pageButtons" :key="buttom.label">
                     <CButton
                        :class="buttom.class"
                        @click="
                           onClickPageButtonsActions(
                              buttom.label,
                              buttom.action
                           )
                        "
                     >
                        <span v-html="buttom.label"></span>
                     </CButton>
                  </span>

                  <CButton
                     class="btn btn-sm btn-outline-success me-1"
                     v-if="props.abilities.includes(props.endpoint + '.store')"
                     @click="form.insertNewModal"
                     ><i class="fa fa-plus"></i> Inserir Novo</CButton
                  >
                  <CButton
                     class="btn btn-sm btn-outline-secondary"
                     @click="refreshTable"
                     ><i class="fa fa-refresh"></i> Recarregar
                  </CButton>
               </div>
            </div>

            <!-- linha da Tabela de dados -->
            <div class="table-responsive col-md-12">
               <table
                  :id="tableId"
                  class="display table table-striped table-bordered table-hover table-sm compact w-100"
               ></table>
            </div>
         </CCardBody>
      </CCard>

      <!-- Edit Form Modal -->
      <CModal
         :visible="form.editModalVisible"
         :size="modalSize"
         :fullscreen="modalFullscreen"
         @close="form.closeModal"
         backdrop="static"
         v-autofocus-first
      >
         <CModalHeader class="bg-primary text-white">
            <CModalTitle>{{
               (form.isEditing.value ? 'Editar ' : 'Inserir ') +
               endpoint.charAt(0).toUpperCase() +
               endpoint.slice(1)
            }}</CModalTitle>
         </CModalHeader>
         <CModalBody>
            <CForm class="form-horizontal">
               <slot name="form" :form="form.form" :errors="form.fieldErrors" />
            </CForm>
            <div class="text-danger small mt-2" v-if="form.formError">
               {{ form.formError }}
            </div>
         </CModalBody>
         <CModalFooter>
            <CButton color="secondary" size="sm" @click="form.closeModal"
               ><i class="fa fa-times"></i> Cancelar</CButton
            >
            <CButton color="primary" size="sm" @click="form.confirmSave"
               ><i class="fa fa-save"></i>
               {{ form.isEditing.value ? 'Salvar' : 'Criar' }}</CButton
            >
         </CModalFooter>
      </CModal>

      <!-- Confirma Excluir Modal  -->
      <CModal
         :visible="form.deleteModalVisible"
         @close="form.closeModal"
         backdrop="static"
      >
         <CModalHeader>
            <strong>Confirmar Exclusão</strong>
         </CModalHeader>
         <CModalBody>
            Tem certeza que deseja excluir este Registro:
            <br />
            <b>{{
               form.selectedToDelete.value?.descricao ||
               form.selectedToDelete.value?.nome ||
               'Nome ou Descrição não encontrada.'
            }}</b>
            ?
            <!-- <pre>{{ JSON.stringify(form.selectedToDelete.value, null, 2) }}</pre> -->
         </CModalBody>
         <CModalFooter>
            <CButton
               color="btn btn-secondary btn-sm me-1"
               @click="form.cancelDelete"
               >Cancelar</CButton
            >
            <CButton
               color="btn btn-danger    btn-sm me-1"
               @click="form.confirmDelete"
               >Excluir</CButton
            >
         </CModalFooter>
      </CModal>
   </CCol>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, watch } from 'vue';
import { useDataTable } from '@/composables/useDataTable';
import { useForm } from '@/composables/useForm';
import { useToast } from '@/composables/useToast';

const { showToast } = useToast();

// Props configuráveis
const props = defineProps({
   title: String,
   modalSize: String,
   modalFullscreen: String,
   description: String,
   endpoint: String,
   columnActionsWidth: String,
   pageButtons: {
      type: Object,
      default: () => [{}],
   },
   defaultValues: {
      type: Object,
      default: () => ({}),
   },
   abilities: {
      type: Array,
      default: () => [],
   },
   buttons: {
      type: Object,
      default: () => ({
         update: true,
         delete: true,
         show: false,
      }),
   },
   columns: {
      type: Array,
      default: () => [
         { title: 'Coluna 1', data: null, class: 'dt-left' },
         { title: 'Coluna 2', data: null, class: 'dt-left' },
      ],
   },
   order: String,
   filters: Array,
   extraColumnRender: Function,
   // canInsert: Boolean,
   // canUpdate: Boolean,
   // canDelete: Boolean,
   canPrint: Boolean,
   onSaved: Function,
   afterSave: Function,
});

// controe os order
// const filtros = ref({});
// console.log('Ref para os Filtros da Página:', props.filters);

// controe os filtros
const filtros = ref({});
// console.log('Ref para os Filtros da Página:', props.filters);

props.filters.forEach((filtro) => {
   if (filtro?.field) {
      filtros.value[filtro.field] = filtro.default ?? '';
   }
});
// console.log('Filtros aplicados à Página:',filtros);

// controe dos pageButtons
// console.log('Ref para os pageButtons da Página:', props.pageButtons);

// Estados e ações
const alert = ref({ type: '', message: '' });
const tableId = `datatable-${props.endpoint}`;

function btnImprimir() {
   showToast({
      title: 'Erro',
      message: 'Imprimir não implementado!',
      color: 'danger',
   });
}

const emit = defineEmits([
   'edit',
   'delete',
   'custom',
   'extraAction',
   'pageButtonsActions',
   'afterSave',
]);

const onClickPageButtonsActions = (label, action) => {
   // showToast({
   //    title: 'Ação',
   //    message: 'Clicou no page Buttom ' + label + ', Ação: ' + action,
   // });

   emit('pageButtonsActions', {
      label: label,
      action: action,
   });
};

// console.log(`Abilities:`, props.abilities);

// Tabela de Dados
const { init, refreshTable } = useDataTable(
   {
      tableId,
      endpoint: props.endpoint,
      order: props.order,
      externalFilters: filtros,
      autoWidth: false, // desativa o ajuste automático para que a largura definida funcione
      columns: [
         ...props.columns,
         {
            title: 'Ações',
            data: null,
            sortable: false,
            className: 'text-center',
            width: props.columnActionsWidth ?? '160px',
            render(data, type, row) {
               let html = '';
               let btnEditar = '';
               let btnExcluir = '';
               let btnVer = '';

               if (props.buttons.update) {
                  btnEditar =
                     `<button ` +
                     (props.abilities.includes(props.endpoint + '.update')
                        ? ''
                        : 'disabled') +
                     ` class="btnEdit btn btn-xs btn-outline-primary me-1" data-id="${row.id}" tooltip="Editar o registro atual"><i class="fa fa-edit"></i> Editar</button>`;
               }

               if (props.buttons.delete) {
                  btnExcluir =
                     `<button ` +
                     (props.abilities.includes(props.endpoint + '.destroy')
                        ? ''
                        : 'disabled') +
                     ` class="btnDelete btn btn-xs btn-outline-danger  me-1" data-id="${row.id}" tooltip="Excluir o registro atual"><i class="fa fa-trash"></i> Excluir</button>`;
               }

               if (props.buttons.show) {
                  btnVer =
                     `<button ` +
                     (props.abilities.includes(props.endpoint + '.show')
                        ? ''
                        : 'disabled') +
                     ` class="btnVer btn btn-xs btn-outline-info  me-1" data-id="${row.id}" tooltip="Ver o registro atual">Ver</button>`;
               }

               html += btnEditar + btnExcluir + btnVer;

               if (props.extraColumnRender) {
                  html += props.extraColumnRender(row);
               }
               return html;
            },
         },
      ],

      onClickSelectViagem: () => abrirModal(),
      onClickEdit: (id) => form.load(id),
      onClickDelete: (rowData) => form.confirmDeleteModal(rowData),
      onClickExtraAction: (id, action, row, dataset, target) => {
         emit('extraAction', { id, action, row, dataset, target });
      },
   },
   emit
);

/**
 * defineExpose() - Expõe o método pro componente pai
 * refreshTable é uma função dentro do composable useDataTable() exposta acima.
 * Mas para expô-la para a view Pai acima desta que estamos que é filha
 * precisamos usar defineExpose()
 */
defineExpose({
   refreshTable,
});

// Formulário
const form = useForm({
   endpoint: props.endpoint,
   defaultValues: props.defaultValues ?? {},
   onSaved: async () => {
      refreshTable();
      showToast({
         title: 'Sucesso',
         message: 'Registro salvo com sucesso!',
      });
      // console.log('onSaved executado');

      emit('afterSave', {
         saved: true,
         data: [],
         timestamp: new Date(),
      });
   },
   afterDelete: () => {
      refreshTable();
      showToast({
         title: 'Sucesso',
         message: 'Registro excluído com sucesso!',
      });
   },
});

// Foca no primeiro campo do formulário quando o modal é aberto
watch(form.editModalVisible, (newValue) => {
   if (newValue) {
      nextTick(() => {
         const firstInput = document.querySelector(
            '.modal-body input, .modal-body select'
         );
         if (firstInput) {
            firstInput.focus();
         }
      });
   }
});

// console.log('defaultValues recebidos', props.defaultValues);
// console.log('canUpdate', props.canUpdate);
// console.log('Todas as abilities:', props.abilities);

const descricaoParaExcluir = computed(() => {
   // TODO - mostrar descrição do registro selecionado para exclusão
   // return form.selectedToDelete.value?.descricao || 'Carregando...'
   return JSON.stringify(form.selectedToDelete.value.descricao);
});

// Início
onMounted(init);
</script>

<style>
/* @import 'datatables.net-dt/css/dataTables.dataTables.min.css'; */
@import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

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
   font-weight: bold !important;
}

.dataTable tbody td {
   font-size: 15px;
   /* font-weight: bold; */
   /* font-size: medium; */
}

/* Fonte dos botões Primeiro/Anterior/... */
.d-none.d-sm-inline {
   font-size: 13px;
}
</style>
