<template>

  <!-- DataTables - Lista de Dados -->
  <CCol :xs="12">
    <!-- <DocsComponents href="components/table.html" /> -->
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Lista de Rotas</strong> <small> - permite administrar as Rotas das Viagens</small>
      </CCardHeader>
      <CCardBody>
        
        <div class="row mb-3 mb-0">
            
          <div class="col-12 col-md-8 text-start">
            <div v-if="alertMessage" class="alert alert-dismissible fade show py-1 px-2 mb-1"
              role="alert" :class="`alert-${alertType}`">{{ alertMessage }}
              <button type="button" class="btn btn-sm btn-close py-2" @click="alertMessage = ''" aria-label="Fechar"></button>
            </div>          
          </div>

          <!-- style="background-color: gainsboro" -->
          <div class="col-12 col-md-4 pb-1 text-end" >
            <button v-if="canInsert" class="btn btn-sm btn-outline-success me-1" @click="insertNewModal">Inserir Novo</button>
            <button class="btn btn-sm btn-outline-info me-1" @click="print">Imprimir</button>
            <button class="btn btn-sm btn-outline-secondary" title="Recarregar" @click="refreshTable"><CIcon icon="cil-task"/> Recarregar</button>
          </div>

        </div> 

        <div class="table-responsive col-md-12">
          <table id="dataTable" class="display table table-striped table-bordered table-hover table-sm compact" style="width:100%"></table>
        </div>

      </CCardBody>
    </CCard>
  </CCol>    

  <!-- Modal de Edição -->
  <CModal :visible="editModalVisible" @close="closeModal" backdrop="static" v-close-on-esc="closeModal" >
  <CModalHeader>
    <CModalTitle>{{ isEditing ? (canUpdate ? 'Editar' : 'Ver') + ' Veículo' : 'Novo Veículo' }}</CModalTitle>
  </CModalHeader>
  <CModalBody>

    <CForm>
      <CFormInput v-model="form.descricao" label="Descrição" class="form-control" :class="{ 'is-invalid': fieldErrors.descricao }"/>
      <div class="form-error" v-if="fieldErrors.descricao">{{ fieldErrors.descricao }}</div>

      <CFormSelect v-model="form.tipo" :options="tipoOptions" label="Tipo"/>
      <div class="form-error" v-if="fieldErrors.tipo">{{ fieldErrors.tipo }}</div>

      <CFormInput v-model="form.marca_modelo" label="Marca/Modelo" />
      <div class="form-error" v-if="fieldErrors.marca_modelo">{{ fieldErrors.marca_modelo }}</div>

      <CFormInput v-model="form.capacidade" label="Capacidade" />
      <div class="form-error" v-if="fieldErrors.capacidade">{{ fieldErrors.capacidade }}</div>

      <CFormInput v-model="form.motorista" label="Motorista" />
      <div class="form-error" v-if="fieldErrors.motorista">{{ fieldErrors.motorista }}</div>

      <CFormInput v-model="form.telefone" label="Telefone" />
      <div class="form-error" v-if="fieldErrors.telefone">{{ fieldErrors.telefone }}</div>

      <CFormSelect v-model="form.ativo" :options="[{ value: 'Y', label: 'SIM' }, { value: 'N', label: 'NÃO' }]" label="Ativo" />
    </CForm>

  </CModalBody>
  <CModalFooter>

    <div class="d-flex w-100 align-items-center justify-content-end">
      <div class="text-danger small mt-2 me-auto" v-if="formError">{{ formError }}</div>
      <div>
        <CButton class="btn btn-secondary btn-sm me-1" @click="closeModal">Cancelar </CButton> 
        <CButton v-if="canUpdate" class="btn btn-primary btn-sm" @click="confirmSave()">{{ isEditing ? 'Salvar' : 'Criar' }}</CButton>
      </div>
    </div>    

  </CModalFooter>
  </CModal>

  <!-- Modal de Confirmação -->
  <CModal :visible="deleteConfirmVisible" @close="cancelDelete" backdrop="static" keyboard="true">
    <CModalHeader>
      <CModalTitle>Confirmar Exclusão</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <p>Tem certeza que deseja excluir este Registro: <br/><strong>{{ selectedToDelete?.descricao }}</strong> ?</p>
    </CModalBody>
    <CModalFooter>
      <CButton class="btn btn-secondary btn-sm me-1" @click="cancelDelete">Cancelar</CButton>
      <CButton class="btn btn-danger btn-sm" @click="confirmDelete">Excluir</CButton>
    </CModalFooter>
  </CModal>  

</template>

<script setup>

import { onMounted, ref } from 'vue'
import $ from 'jquery'
import 'datatables.net-dt'
import { useRotasApi } from '@/composables/useRotasApi'

const { fetchVeiculos, canInsert, canUpdate, canDelete, canShow } = useRotasApi()
const dataTable = ref(null)

function initDataTable() {
  const vm = { canInsert, canUpdate, canDelete, canShow }

  dataTable.value = $('#dataTable').DataTable({
    ajax: function (dataTablesParams, callback) {
      fetchVeiculos()
        .then(data => callback({ data }))
        .catch(() => callback({ data: [] }))
    },
    lengthMenu: [[5, 10, 15, 30, 50, -1], [5, 10, 15, 30, 50, "Todos"]],     
    language: { url: "/assets/DataTables.pt_BR.json" },
    processing: true,
    responsive: true,
    rowId: 'id',

    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Descrição', data: 'descricao' },
      { title: 'Tipo', data: 'tipo' },
      { title: 'Marca/Modelo', data: 'marca_modelo' },
      { title: 'Cpc', data: 'capacidade' },
      { title: 'Motorista', data: 'motorista' },
      { title: 'Fone', data: 'telefone' },
      { title: 'Ativo', data: 'ativo', class: 'dt-center small', 
        render: function (data, type, row) {
          return `<span class="${row.ativo === 'Y' ? 'text-primary' : 'text-danger'}">${row.ativo === 'Y' ? 'SIM' : 'NÃO'}</span>`;
        },
      },
      // { title: 'Ativo', data: 'ativo', render: d => d === 'Y' ? 'SIM' : 'NÃO' },
      {
        title: 'Ações',
        data: null,
        render(data, type, row) {
          const btnEdit = vm.canUpdate ? `<button class="btnEdit btn btn-xs btn-outline-primary me-1" data-id="${row.id}">Editar</button>` : ''
          const btnShow = vm.canShow && !vm.canUpdate ? `<button class="btnShow btn btn-xs btn-outline-primary me-1" data-id="${row.id}">Ver</button>` : ''
          const btnDel = vm.canDelete ? `<button class="btnDelete btn btn-xs btn-outline-danger me-1" data-id="${row.id}">Excluir</button>` : ''
          return btnEdit + btnShow + btnDel
        }
      }
    ]
  })
}

function refreshTable() {
  if (dataTable.value) {
    dataTable.value.ajax.reload(null, false)
  }
}

onMounted(() => {
  initDataTable()

})
</script>
