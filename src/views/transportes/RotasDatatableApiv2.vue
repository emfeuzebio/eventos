<template>
   <CCol :xs="12">
      <CCard class="mb-4">
         <CCardHeader>
            <strong>Rotas</strong> <small>- Administração de Veículos</small>
         </CCardHeader>
         <CCardBody>
            <div class="d-flex justify-content-between mb-2">
               <div>
                  <!-- Alerta -->
                  <CAlert v-if="formError" color="danger" dismissible>
                     {{ formError }}
                  </CAlert>
               </div>

               <!-- Botões -->
               <div>
                  <CButton color="success" size="sm" @click="openNew"
                     >Novo</CButton
                  >
                  <CButton
                     color="secondary"
                     size="sm"
                     class="ms-2"
                     @click="refreshTable"
                     >Recarregar</CButton
                  >
               </div>
            </div>

            <!-- Tabela -->
            <div class="table-responsive">
               <table
                  id="dataTable"
                  class="table table-striped table-bordered table-sm w-100"
               ></table>
            </div>
         </CCardBody>
      </CCard>

      <!-- Modal -->
      <CModal :visible="editModalVisible" @close="closeModal" backdrop="static">
         <CModalHeader>
            <CModalTitle>{{
               isEditing ? 'Editar Veículo' : 'Novo Veículo'
            }}</CModalTitle>
         </CModalHeader>
         <CModalBody>
            <CForm>
               <CFormInput
                  v-model="form.descricao"
                  label="Descrição"
                  :invalid="!!fieldErrors.descricao"
               />
               <div class="text-danger small" v-if="fieldErrors.descricao">
                  {{ fieldErrors.descricao }}
               </div>

               <CFormInput
                  v-model="form.tipo"
                  label="Tipo"
                  :invalid="!!fieldErrors.tipo"
               />
               <div class="text-danger small" v-if="fieldErrors.tipo">
                  {{ fieldErrors.tipo }}
               </div>

               <CFormInput v-model="form.marca_modelo" label="Marca/Modelo" />
               <CFormInput v-model="form.capacidade" label="Capacidade" />
               <CFormInput v-model="form.motorista" label="Motorista" />
               <CFormInput v-model="form.telefone" label="Telefone" />
               <CFormSelect
                  v-model="form.ativo"
                  :options="[
                     { value: 'Y', label: 'SIM' },
                     { value: 'N', label: 'NÃO' },
                  ]"
                  label="Ativo"
               />
            </CForm>
         </CModalBody>
         <CModalFooter>
            <CButton color="secondary" size="sm" @click="closeModal"
               >Cancelar</CButton
            >
            <CButton
               :disabled="loading"
               color="primary"
               size="sm"
               @click="submit"
               >Salvar</CButton
            >
         </CModalFooter>
      </CModal>
   </CCol>

   <!-- Modal de confirmação -->
   <CModal
      :visible="deleteModalVisible"
      @close="cancelDelete"
      backdrop="static"
   >
      <CModalHeader>
         <strong>Confirmar Exclusão</strong>
      </CModalHeader>
      <CModalBody>
         Tem certeza que deseja excluir este Registro: <br /><b>{{
            selectedToDelete?.descricao
         }}</b>
         ?
      </CModalBody>
      <CModalFooter>
         <CButton color="btn btn-secondary btn-sm me-1" @click="cancelDelete"
            >Cancelar</CButton
         >
         <CButton color="btn btn-danger    btn-sm me-1" @click="confirmDelete"
            >Excluir</CButton
         >
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { onMounted } from 'vue';
import { useForm } from '@/composables/useForm';
import { useDataTable } from '@/composables/useDataTable';

function refreshTable() {
   datatable.refreshTable();
}

// Formulário de criação/edição
const {
   isEditing,
   loading,
   editModalVisible,
   deleteModalVisible,
   form,
   fieldErrors,
   formError,
   selectedToDelete,
   load,
   submit,
   openNew,
   closeModal,
   confirmDeleteModal,
   cancelDelete,
   confirmDelete,
} = useForm({
   endpoint: 'veiculo',
   fields: {
      descricao: '',
      tipo: '',
      marca_modelo: '',
      capacidade: '',
      motorista: '',
      telefone: '',
      ativo: 'Y',
      id: null,
   },
   afterSubmit: refreshTable,
});

// DataTable
const datatable = useDataTable({
   tableId: 'dataTable',
   endpoint: 'veiculo',

   onClickEdit: (id) => load(id),
   onClickDelete: (id) => confirmDeleteModal(id),

   columns: [
      { title: 'ID', data: 'id' },
      { title: 'Descrição', data: 'descricao' },
      { title: 'Tipo', data: 'tipo' },
      { title: 'Marca/Modelo', data: 'marca_modelo' },
      { title: 'Capacidade', data: 'capacidade' },
      { title: 'Motorista', data: 'motorista' },
      { title: 'Telefone', data: 'telefone' },
      {
         title: 'Ativo',
         data: 'ativo',
         className: 'text-center',
         render: (d) => (d === 'Y' ? 'SIM' : 'NÃO'),
      },
      {
         title: 'Ações',
         data: null,
         orderable: false,
         render: (_, __, row) =>
            `<button class="btnEdit btn btn-xs btn-outline-primary" data-id="${row.id}">Editar</button>
         <button class="btnDelete btn btn-xs btn-outline-danger ms-1" data-id="${row.id}">Excluir</button>
        `,
      },
   ],
});

onMounted(() => {
   datatable.init();
});
</script>
