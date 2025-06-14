<template>
   <CCol :xs="12">
      <CCard class="mb-4">
         <CCardHeader>
            <strong>{{ title }}</strong>
            <small v-if="description">- {{ description }}</small>
         </CCardHeader>
         <CCardBody>
            <div class="row mb-1 mb-0">
               <!-- Alerta de Confirmações -->
               <div class="col-12 col-md-8 text-start">
                  <div
                     v-if="alert.message"
                     :class="`alert alert-${alert.type || 'info'}`"
                     class="alert alert-dismissible fade show py-1 px-2 mb-0"
                     role="alert"
                  >
                     {{ alert.message }}
                     <button
                        type="button"
                        class="btn btn-sm btn-close py-2"
                        @click="closeAlert"
                        aria-label="Fechar"
                     ></button>
                  </div>
               </div>

               <!-- Botões -->
               <div class="col-12 col-md-4 pb-1 text-end">
                  <CButton
                     class="btn btn-sm btn-outline-info me-1"
                     v-if="canPrint"
                     @click="btnImprimir"
                     >Imprimir</CButton
                  >
                  <CButton
                     class="btn btn-sm btn-outline-success me-1"
                     v-if="canInsert"
                     @click="form.insertNewModal"
                     >Inserir Novo</CButton
                  >
                  <CButton
                     class="btn btn-sm btn-outline-secondary me-1"
                     @click="refreshTable"
                     >Recarregar</CButton
                  >
               </div>
            </div>

            <!-- Tabela de dados -->
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
         @close="form.closeModal"
         backdrop="static"
         keyboard="true"
      >
         <CModalHeader>
            <CModalTitle>{{ form.isEditing ? 'Editar' : 'Novo' }}</CModalTitle>
         </CModalHeader>
         <CModalBody>
            <CForm>
               <slot name="form" :form="form.form" :errors="form.fieldErrors" />
            </CForm>
            <div class="text-danger small mt-2" v-if="form.formError">
               {{ form.formError }}
            </div>
         </CModalBody>
         <CModalFooter>
            <CButton color="secondary" size="sm" @click="form.closeModal"
               >Cancelar</CButton
            >
            <CButton color="primary" size="sm" @click="form.confirmSave">{{
               form.isEditing ? 'Salvar' : 'Criar'
            }}</CButton>
         </CModalFooter>
      </CModal>

      <!-- Confirma Excluir Modal  -->
      <CModal
         :visible="form.deleteModalVisible"
         @close="form.closeModal"
         backdrop="static"
         keyboard="true"
      >
         <CModalHeader>
            <strong>Confirmar Exclusão</strong>
         </CModalHeader>
         <CModalBody>
            Tem certeza que deseja excluir este Registro:
            <br />
            <b>{{
               form.selectedToDelete.value?.descricao || 'Carregando...'
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
import { onMounted, ref, computed } from 'vue';
import { useDataTable } from '@/composables/useDataTable';
import { useForm } from '@/composables/useForm';

// Props configuráveis
const props = defineProps({
   title: String,
   description: String,
   endpoint: String,
   columns: Array,
   defaultValues: Object,
   abilities: Array,
   canInsert: Boolean,
   canUpdate: Boolean,
   canDelete: Boolean,
   canPrint: Boolean,
});

// Estados e ações
const alert = ref({ type: '', message: '' });
const tableId = `datatable-${props.endpoint}`;

function showAlert(type, message) {
   alert.value = { type, message };
   setTimeout(() => (alert.value.message = ''), 5000);
}

function closeAlert() {
   alert.value.message = '';
}

function btnImprimir() {
   showAlert('danger', 'Imprimir não implementado.');
}

// Tabela de Dados
const { init, refreshTable } = useDataTable({
   tableId,
   endpoint: props.endpoint,
   columns: [
      ...props.columns,
      {
         title: 'Ações',
         data: null,
         sortable: false,
         className: 'text-center',
         width: '120px',
         render(data, type, row) {
            return (
               `
          <button class="btnEdit   btn btn-xs btn-outline-primary me-1" data-id="${row.id}"` +
               (props.canUpdate ? '' : 'disabled') +
               ` >Editar</button>
          <button class="btnDelete btn btn-xs btn-outline-danger  me-1" data-id="${row.id}"` +
               (props.canDelete ? '' : 'disabled') +
               ` >Excluir</button>
        `
            );
         },
      },
   ],

   onClickEdit: (id) => form.load(id),
   onClickDelete: (rowData) => form.confirmDeleteModal(rowData),
});

// Formulário
const form = useForm({
   endpoint: props.endpoint,
   defaultValues: props.defaultValues ?? {},
   onSaved: () => {
      refreshTable();
      showAlert('success', 'Registro salvo com sucesso.');
   },
   afterDelete: () => {
      refreshTable();
      showAlert('success', 'Registro excluído com sucesso.');
   },
});

// console.log('defaultValues recebidos', props.defaultValues);
// console.log('canUpdate', props.canUpdate);
console.log('Todas as abilities:', props.abilities);

const descricaoParaExcluir = computed(() => {
   // TODO - mostrar descrição do registro selecionado para exclusão
   // return form.selectedToDelete.value?.descricao || 'Carregando...'
   return JSON.stringify(form.selectedToDelete.value.descricao);
});

// Início
onMounted(init);
</script>
