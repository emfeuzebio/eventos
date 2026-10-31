// src/composables/useForm.js
import { ref, computed, toRaw } from 'vue';
import api from '@/services/api';
import { useCurrentEventStore } from '@/stores/currentEvent';

export function useForm({
   endpoint,
   fields,
   defaultValues,
   onSaved,
   afterDelete,
   onLoaded,
   apiInstance = api,        // ← NOVO
   includeEventoId = true,   // ← NOVO
}) {
   const form = ref({ ...fields });
   const isEditing = ref(false);

   const editModalVisible = ref(false);

   const loading = ref(false);
   const fieldErrors = ref({});
   const formError = ref('');

   const selectedToDelete = ref({});
   const deleteModalVisible = ref(false);

   const eventStore = useCurrentEventStore();
   const globalEventoId = computed(() => eventStore.currentEvent?.id || '');

   async function load(id = 0) {
      try {
         loading.value = true;

         const params = {};
         if (includeEventoId) {
            params.evento_id = globalEventoId.value;
         }

         const res = await apiInstance.get(`${endpoint}/${id}`, { params });

         form.value = {
            ...toRaw(defaultValues),
            ...res.data
         };

         if (onLoaded) {
            onLoaded(form.value);
         }

         isEditing.value = id ?? false;
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
      formError.value = { type, message };
      setTimeout(() => (alert.value.message = ''), 5000);
   }

   function clearFieldErrors() {
      fieldErrors.value = {};
   }

   function clearFieldData() {
      form.value = { ...defaultValues };
      isEditing.value = false;
      formError.value = '';
      clearFieldErrors();
   }

   async function insertNewModal() {
      clearFieldData();
      await load();
      editModalVisible.value = true;
   }

   function closeModal() {
      editModalVisible.value = false;
      clearFieldData();
   }

   async function print() {
      try {
         const response = await apiInstance.get(`/hotel/relhospedagemdoevento/${globalEventoId.value}`, {
            responseType: 'blob',
         });

         const blob = new Blob([response.data], { type: 'application/pdf' });
         const url = window.URL.createObjectURL(blob);
         window.open(url, '_blank');
         window.URL.revokeObjectURL(url);

         showToast({
            title: 'Sucesso',
            message: `Relatório gerado com sucesso.`,
         });
      } catch (error) {
         console.log('useForm: Erro ao gerar relatório:', error.response?.data.message);
      }
   }

   function confirmDeleteModal(rowData) {
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

         await apiInstance.delete(`${endpoint}/${id}`);

         deleteModalVisible.value = false;
         afterDelete?.();
      } catch (error) {
         // erro tratado pelo interceptor
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
            await apiInstance.put(`${endpoint}/${form.value.id}`, form.value);
         } else {
            await apiInstance.post(endpoint, form.value);
         }

         editModalVisible.value = false;
         onSaved?.();
      } catch (error) {
         if (error.response?.status === 422) {
            fieldErrors.value = error.response.data.errors || {};
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
      onLoaded,
      load,
      confirmSave,
      insertNewModal,
      closeModal,
      confirmDeleteModal,
      cancelDelete,
      confirmDelete,
      print,
   };
}