// src/composables/useForm.js
import { ref } from 'vue'
import api from '@/services/api'

export function useForm({ endpoint, fields, afterSubmit }) {

  const form = ref({ ...fields })
  const isEditing = ref(false)

  const modalVisible = ref(false)
  const confirmeDeleteModal = ref(false)

  const loading = ref(false)
  const fieldErrors = ref({})
  const formError = ref('')

  const selectedToDelete = ref({})

  async function load(id) {
    try {
      loading.value = true
      const res = await api.get(`${endpoint}/${id}`)
      form.value = { ...fields, ...res.data }
      isEditing.value = true
      formError.value = ''
      clearFieldErrors()
      modalVisible.value = true
    } catch (err) {
      formError.value = err.response?.data?.message || 'Erro ao carregar dados'
    } finally {
      loading.value = false
    }
  }

  function confirmeDelete(rowData) {
    console.log(`Confirmação de exclusão para o ID: ${rowData}`)
    selectedToDelete.value = rowData
    console.log(selectedToDelete.value)
    confirmeDeleteModal.value = true
  }

  async function submit() {
    try {
      loading.value = true
      formError.value = ''
      clearFieldErrors()

      if (isEditing.value) {
        await api.put(`${endpoint}/${form.value.id}`, form.value)
      } else {
        await api.post(endpoint, form.value)
      }

      modalVisible.value = false
      afterSubmit?.()
    } catch (err) {
      if (err.response?.status === 422) {
        fieldErrors.value = err.response.data.errors || {}
      } else {
        formError.value = err.response?.data?.message || 'Erro ao salvar dados'
      }
    } finally {
      loading.value = false
    }
  }

  function reset() {
    form.value = { ...fields }
    isEditing.value = false
    formError.value = ''
    clearFieldErrors()
  }

  function openNew() {
    reset()
    modalVisible.value = true
  }

  function clearFieldErrors() {
    fieldErrors.value = {}
  }

  function closeModal() {
    modalVisible.value = false
    reset()
  }

  function cancelDelete() {
    selectedToDelete.value = null
    confirmeDeleteModal.value = false
  }
  
  return {
    form,
    isEditing,
    modalVisible,
    confirmeDeleteModal,
    selectedToDelete,
    loading,
    fieldErrors,
    formError,
    load,
    submit,
    openNew,
    closeModal,
    confirmeDelete,
    cancelDelete
  }
}
