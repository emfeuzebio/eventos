<template>
   <CCol :xs="12">
      <CCard class="mb-4">
         <CCardHeader>
            <strong>Lista de Veículos</strong>
            <small> - permite administrar os veículos</small>
         </CCardHeader>
         <CCardBody>
            <div class="row mb-3 mb-0">
               <div class="col-12 col-md-8 text-start">
                  <div
                     v-if="alertMessage"
                     class="alert alert-dismissible fade show py-1 px-2 mb-1"
                     role="alert"
                     :class="`alert-${alertType}`"
                  >
                     {{ alertMessage }}
                     <button
                        type="button"
                        class="btn btn-sm btn-close py-2"
                        @click="alertMessage = ''"
                        aria-label="Fechar"
                     ></button>
                  </div>
               </div>
               <div class="col-12 col-md-4 pb-1 text-end">
                  <button
                     v-if="canInsert"
                     class="btn btn-sm btn-outline-success me-1"
                     @click="insertNewModal"
                  >
                     Inserir Novo
                  </button>
                  <button
                     class="btn btn-sm btn-outline-info me-1"
                     @click="print"
                  >
                     Imprimir
                  </button>
                  <button
                     class="btn btn-sm btn-outline-secondary"
                     title="Recarregar"
                     @click="refreshTable"
                  >
                     <CIcon icon="cil-task" /> Recarregar
                  </button>
               </div>
            </div>

            <div class="table-responsive col-md-12">
               <table
                  id="dataTable"
                  class="display table table-striped table-bordered table-hover table-sm compact"
                  style="width: 100%"
               ></table>
            </div>
         </CCardBody>
      </CCard>
   </CCol>

   <!-- Modais reutilizados -->
   <EditModal
      v-if="editModalVisible"
      :visible="editModalVisible"
      :form="form"
      :fieldErrors="fieldErrors"
      :formError="formError"
      :isEditing="isEditing"
      :canUpdate="canUpdate"
      @close="closeModal"
      @save="confirmSave"
   />

   <ConfirmDeleteModal
      :visible="deleteConfirmVisible"
      :item="selectedToDelete"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
   />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import $ from 'jquery';
import 'datatables.net-dt';
import api from '@/services/api';
import { useUserStore } from '@/stores/userStore';
import { can } from '@/services/AuthorizationsService';

// Components externos (você pode separá-los em arquivos ou mantê-los inline)
// import EditModal from './EditModal.vue';
// import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

// Permissões
const canList = ref(can('veiculo.index'));
const canShow = ref(can('veiculo.show'));
const canInsert = ref(can('veiculo.store'));
const canUpdate = ref(can('veiculo.update'));
const canDelete = ref(can('veiculo.destroy'));

// Estados reativos
const alertMessage = ref('');
const alertType = ref('');
const deleteConfirmVisible = ref(false);
const selectedToDelete = ref(null);
const editModalVisible = ref(false);
const isEditing = ref(false);
const formError = ref('');
const fieldErrors = reactive({});
const modalModo = ref(''); // 'edit' | 'show'
const form = reactive({
   id: null,
   descricao: '',
   tipo: '',
   marca_modelo: '',
   capacidade: '',
   motorista: '',
   telefone: '',
   ativo: 'Y',
});
const tipoOptions = [
   { value: '', label: 'Selecione o tipo' },
   { value: 'Automóvel', label: 'Automóvel' },
   { value: 'Van', label: 'Van' },
   { value: 'Micrônibus', label: 'Micrônibus' },
   { value: 'Ônibus', label: 'Ônibus' },
];

let dataTable = null;

onMounted(() => {
   initDataTable();
   $('#dataTable').on('click', '.btnShow', (e) => handleRowAction(e, 'show'));
   $('#dataTable').on('click', '.btnEdit', (e) => handleRowAction(e, 'edit'));
   $('#dataTable').on('click', '.btnDelete', (e) => {
      const id = $(e.currentTarget).data('id');
      const rowData = dataTable.row(`#${id}`).data();
      deleteConfirm(rowData);
   });
});

function handleRowAction(e, action) {
   const id = $(e.currentTarget).data('id');
   editModal(id, action === 'edit');
}

function insertNewModal() {
   clearForm();
   modalModo.value = 'create';
   editModalVisible.value = true;
}

function clearForm() {
   Object.assign(form, {
      id: null,
      descricao: '',
      tipo: '',
      marca_modelo: '',
      capacidade: '',
      motorista: '',
      telefone: '',
      ativo: 'Y',
   });
   formError.value = '';
   Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k]);
}

function editModal(id, editing) {
   api.get(`veiculo/${id}`)
      .then((res) => {
         Object.assign(form, res.data);
         modalModo.value = editing ? 'edit' : 'show';
         isEditing.value = editing;
         editModalVisible.value = true;
      })
      .catch((err) => {
         showAlert('danger', `Erro ao buscar o registro: ${err.message}`);
      });
}

function closeModal() {
   editModalVisible.value = false;
   clearForm();
}

function deleteConfirm(rowData) {
   selectedToDelete.value = rowData;
   deleteConfirmVisible.value = true;
}

function cancelDelete() {
   deleteConfirmVisible.value = false;
   selectedToDelete.value = null;
}

function confirmDelete() {
   const id = selectedToDelete.value.id;
   api.delete(`veiculo/${id}`)
      .then(() => {
         showAlert('success', 'Registro excluído com sucesso!');
         refreshTable();
      })
      .catch((err) => {
         showAlert('danger', `Erro ao excluir o registro: ${err.message}`);
      })
      .finally(() => {
         deleteConfirmVisible.value = false;
      });
}

function confirmSave() {
   formError.value = '';
   Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k]);

   const saveFn =
      modalModo.value === 'edit'
         ? api.put(`veiculo/${form.id}`, form)
         : api.post('veiculo', form);

   saveFn
      .then(() => {
         showAlert(
            'success',
            `Registro ${
               modalModo.value === 'edit' ? 'atualizado' : 'criado'
            } com sucesso!`
         );
         refreshTable();
         closeModal();
      })
      .catch((err) => {
         const errors = err.response?.data?.errors || {};
         for (const campo in errors) {
            fieldErrors[campo] = errors[campo][0];
         }
         formError.value =
            err.response?.data?.message || 'Erro ao salvar o registro.';
      });
}

function refreshTable() {
   if (dataTable) {
      dataTable.ajax.reload(null, false);
   }
}

function print() {
   api.get('viagem')
      .then(() => {
         showAlert('success', 'Operação executada com sucesso!');
      })
      .catch((err) => {
         showAlert('danger', `Erro na operação: ${err.message}`);
      });
}

function showAlert(type, message) {
   alertType.value = type;
   alertMessage.value = message;
   setTimeout(() => {
      alertMessage.value = '';
   }, 5000);
}

function initDataTable() {
   dataTable = $('#dataTable').DataTable({
      ajax: function (params, callback) {
         api.get('veiculo')
            .then((res) => callback({ data: res.data }))
            .catch((err) => {
               showAlert('danger', `Erro ao carregar dados: ${err.message}`);
               callback({ data: [] });
            });
      },
      rowId: 'id',
      columns: [
         { title: 'ID', data: 'id', class: 'text-secondary small' },
         { title: 'Descrição', data: 'descricao', class: 'small' },
         { title: 'Tipo', data: 'tipo', class: 'small' },
         { title: 'Marca/Modelo', data: 'marca_modelo', class: 'small' },
         { title: 'Cpc', data: 'capacidade', class: 'small' },
         { title: 'Motorista', data: 'motorista', class: 'small' },
         { title: 'Fone', data: 'telefone', class: 'small' },
         {
            title: 'Ativo',
            data: 'ativo',
            class: 'dt-center small',
            render: (data, type, row) =>
               `<span class="${
                  row.ativo === 'Y' ? 'text-primary' : 'text-danger'
               }">${row.ativo === 'Y' ? 'SIM' : 'NÃO'}</span>`,
         },
         {
            title: 'Ações',
            data: null,
            class: 'dt-center text-center',
            render: (data, type, row) => {
               const btnEdit = canUpdate.value
                  ? `<button class="btnEdit btn btn-xs btn-outline-primary me-1" data-id="${row.id}">Editar</button>`
                  : '';
               const btnShow =
                  !canUpdate.value && canShow.value
                     ? `<button class="btnShow btn btn-xs btn-outline-primary me-1" data-id="${row.id}">Ver</button>`
                     : '';
               const btnDelete = canDelete.value
                  ? `<button class="btnDelete btn btn-xs btn-outline-danger" data-id="${row.id}">Excluir</button>`
                  : '';
               return btnEdit + btnShow + btnDelete;
            },
         },
      ],
      language: { url: '/assets/DataTables.pt_BR.json' },
      processing: true,
      responsive: true,
      lengthMenu: [
         [5, 10, 15, 30, 50, -1],
         [5, 10, 15, 30, 50, 'Todos'],
      ],
   });
}
</script>
