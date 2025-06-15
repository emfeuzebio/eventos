// src/composables/useForm.js
import { ref } from 'vue';
import api from '@/services/api';
import { checkAuthBeforeSensitiveAction } from '@/composables/useAuthGuard';

export function useForm({
   endpoint,
   fields,
   defaultValues,
   onSaved,
   afterDelete,
}) {
   const form = ref({ ...fields });
   const isEditing = ref(false);

   const editModalVisible = ref(false);

   const loading = ref(false);
   const fieldErrors = ref({});
   const formError = ref('');

   const selectedToDelete = ref({});
   const deleteModalVisible = ref(false);

   async function load(id) {
      try {
         loading.value = true;
         const res = await api.get(`${endpoint}/${id}`);
         form.value = { ...fields, ...res.data };
         isEditing.value = true;
         formError.value = '';
         clearFieldErrors();
         editModalVisible.value = true;
      } catch (err) {
         formError.value =
            err.response?.data?.message || 'Erro ao carregar dados';
      } finally {
         loading.value = false;
      }
   }

   function showAlert(type, message) {
      // alert.value = { type, message }
      formError.value = { type, message };
      setTimeout(() => (alert.value.message = ''), 5000);
   }

   function clearFieldErrors() {
      fieldErrors.value = {};
   }

   function clearFieldData() {
      // console.log('Reiniciando form com defaultValues:', defaultValues);
      form.value = { ...defaultValues };
      isEditing.value = false;
      formError.value = '';
      clearFieldErrors();
   }

   async function onInsertNewClicked() {
      const ok = await checkAuthBeforeSensitiveAction();
      if (!ok) return;

      insertNewModal(); // agora você pode abrir o modal com segurança
   }

   function insertNewModal() {
      clearFieldData();
      editModalVisible.value = true;
   }

   function closeModal() {
      editModalVisible.value = false;
      clearFieldData();
   }

   function confirmDeleteModal(rowData) {
      // console.log(`Confirmação de exclusão para o ID:`)
      selectedToDelete.value = { ...rowData };
      deleteModalVisible.value = true;
   }

   function cancelDelete() {
      selectedToDelete.value = null;
      deleteModalVisible.value = false;
   }

   async function confirmDelete() {
      try {
         const id = selectedToDelete.value.id;
         loading.value = true;

         await api.delete(`${endpoint}/${id}`);

         deleteModalVisible.value = false;
         afterDelete?.();
      } finally {
         loading.value = false;
      }
   }

   async function confirmSave() {
      try {
         loading.value = true;
         formError.value = '';
         clearFieldErrors();

         if (isEditing.value) {
            await api.put(`${endpoint}/${form.value.id}`, form.value);
         } else {
            await api.post(endpoint, form.value);
         }

         editModalVisible.value = false;
         onSaved?.();
      } catch (error) {
         if (error.response?.status === 422) {
            fieldErrors.value = error.response.data.errors || {};
            console.log(fieldErrors.value);
         }
      } finally {
         loading.value = false;
      }
   }

   return {
      form,
      isEditing,
      editModalVisible,
      deleteModalVisible,
      selectedToDelete,
      loading,
      fieldErrors,
      formError,
      load,
      confirmSave,
      insertNewModal,
      onInsertNewClicked,
      closeModal,
      confirmDeleteModal,
      cancelDelete,
      confirmDelete,
   };
}
