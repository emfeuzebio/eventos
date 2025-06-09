<template>
  <CCol :xs="12">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>{{ title }}</strong>
        <small v-if="description"> - {{ description }}</small>
      </CCardHeader>
      <CCardBody>

        <!-- Botões -->
        <div class="d-flex justify-content-end mb-2">
          <CButton v-if="canInsert" size="sm" color="success" @click="form.openForCreate">Novo</CButton>
          <CButton color="secondary" size="sm"   class="ms-2" @click="refreshTable">Recarregar</CButton>
        </div>

        <!-- Alerta -->
        <div v-if="alert.message" :class="`alert alert-${alert.type}`">
          {{ alert.message }}
        </div>

        <!-- Tabela -->
        <!-- <div class="table-responsive col-md-12">
          <table id="dataTable" class="display table table-striped table-bordered table-hover table-sm compact" style="width:100%"></table> -->

        <div class="table-responsive">
          <table :id="tableId" class="display table table-striped table-bordered table-hover table-sm compact w-100"></table>
        </div>
      </CCardBody>
    </CCard>

    <!-- Edit Form Modal -->
    <CModal :visible="form.editModalVisible" @close="form.closeModal" backdrop="static" keyboard="true">
      <CModalHeader>
        <CModalTitle>{{ form.isEditing ? 'Editar' : 'Novo' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <slot name="form" :form="form.form" :errors="form.fieldErrors" />
        </CForm>
        <div class="text-danger small mt-2" v-if="form.formError">{{ form.formError }}</div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" size="sm" @click="form.closeModal">Cancelar</CButton>
        <CButton color="primary" size="sm" @click="form.saveModal">{{ form.isEditing ? 'Salvar' : 'Criar' }}</CButton>
      </CModalFooter>
    </CModal>

    <!-- Modal Excluir -->
    <CModal :visible="form.deleteModalVisible" @close="form.closeModal" backdrop="static" keyboard="true">
      <CModalHeader>
        <strong>Confirmar Exclusão</strong>
      </CModalHeader>
      <CModalBody>
        Tem certeza que deseja excluir este Registro: <br />
        <b>{{ form.selectedToDelete.value?.descricao || 'Carregando...' }}</b> ?
        <!-- <pre>{{ JSON.stringify(form.selectedToDelete.value, null, 2) }}</pre> -->
      </CModalBody>
      <CModalFooter>
        <CButton color="btn btn-secondary btn-sm me-1" @click="form.cancelDelete">Cancelar</CButton>
        <CButton color="btn btn-danger    btn-sm me-1" @click="form.confirmDelete">Excluir</CButton>
      </CModalFooter>
    </CModal>

  </CCol>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useDataTable } from '@/composables/useDataTable'
import { useForm } from '@/composables/useForm'
import $ from 'jquery'

// Props configuráveis
const props = defineProps({
  title: String,
  description: String,
  endpoint: String,
  columns: Array,
  defaultValues: Object,
  canInsert: Boolean,
  canUpdate: Boolean,
  canDelete: Boolean,
})

// Estados e ações
const alert = ref({ type: '', message: '' })
const tableId = `datatable-${props.endpoint}`
// console.log('canDelete:', canDelete)

function showAlert(type, message) {
  alert.value = { type, message }
  setTimeout(() => (alert.value.message = ''), 5000)
}

// const objetoMaster = {
//   a:1,
//   b:2,
//   c:3,
// }

// const copia = {...objetoMaster, d:4}


// const {a} = objetoMaster
// const a = objetoMaster.a
// const init = useDataTable.init

// {
//         init,
//         refreshTable,
//         dataTable,
//     }
// Tabela
const { init, refreshTable, canUpdate, canDelete } = useDataTable({
  tableId,
  endpoint: props.endpoint,
  columns: [
    ...props.columns,
    {
      title: 'Ações',
      data: null,
      render(data, type, row) {

        return `
          <button class="btnEdit   btn btn-xs btn-outline-primary me-1" data-id="${row.id}"` + ( true ? '' : 'disabled' ) + ` >Editar</button>
          <button class="btnDelete btn btn-xs btn-outline-danger  me-1" data-id="${row.id}"` + ( true ? '' : 'disabled' ) + ` >Excluir</button>
        `
      },
    },
  ],

  // onClickEdit: (id) => form.openForEdit(id),

  onClickEdit:   (id) => form.load(id),
  onClickDelete: (rowData) => form.confirmModalDelete(rowData),

})

// Formulário
const form = useForm({
  endpoint: props.endpoint,
  defaultValues: props.defaultValues,
  onSaved: () => {
    refreshTable()
    showAlert('success', 'Registro salvo com sucesso.')
  },
  afterDelete: () => {
    refreshTable()
    showAlert('success', 'Registro excluído com sucesso.')
  }  
})

const descricaoParaExcluir = computed(() => {
  // TOTO - mostrar descrição do registro selecionado para exclusão
  // return form.selectedToDelete.value?.descricao || 'Carregando...'
  return JSON.stringify(form.selectedToDelete.value.descricao)
  // return "qqqqqqqqqqqqqqqqq";
})


// Início
onMounted(init)
</script>
