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
        </div>

        <!-- Alerta -->
        <div v-if="alert.message" :class="`alert alert-${alert.type}`">
          {{ alert.message }}
        </div>

        <!-- Tabela -->
        <div class="table-responsive">
          <table :id="tableId" class="display table table-bordered table-hover w-100"></table>
        </div>
      </CCardBody>
    </CCard>

    <!-- Modal Form -->
    <CModal :visible="form.modalVisible" @close="form.close">
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
        <CButton color="secondary" size="sm" @click="form.close">Cancelar</CButton>
        <CButton color="primary" size="sm" @click="form.save">{{ form.isEditing ? 'Salvar' : 'Criar' }}</CButton>
      </CModalFooter>
    </CModal>
  </CCol>
</template>

<script setup>
import { onMounted, ref } from 'vue'
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
})

// Estados e ações
const alert = ref({ type: '', message: '' })
const tableId = `datatable-${props.endpoint}`

function showAlert(type, message) {
  alert.value = { type, message }
  setTimeout(() => (alert.value.message = ''), 5000)
}

// Tabela
const { init, reload } = useDataTable({
  tableId,
  endpoint: props.endpoint,
  columns: [
    ...props.columns,
    {
      title: 'Ações',
      data: null,
      render(data, type, row) {
        return `
          <button class="btnEdit   btn btn-xs btn-outline-primary me-1" data-id="${row.id}">Editar</button>
          <button class="btnDelete btn btn-xs btn-outline-danger me-1"  data-id="${row.id}">Excluir</button>
        `
      },
    },
  ],
  onClickEdit: (id) => form.openForEdit(id),
})

// Formulário
const form = useForm({
  endpoint: props.endpoint,
  defaultValues: props.defaultValues,
  onSaved: () => {
    reload()
    showAlert('success', 'Registro salvo com sucesso.')
  },
})

// Início
onMounted(init)
</script>
