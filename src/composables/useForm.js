// src/composables/useForm.js
import { ref, computed, toRaw } from 'vue';
import api from '@/services/api';
import { useCurrentEventStore } from '@/stores/currentEvent'
const eventStore = useCurrentEventStore()

export function useForm({
   endpoint,
   fields,
   defaultValues,
   onSaved,
   afterDelete,
   onLoaded,  // ← ADICIONAR ESTA LINHA
}) {
   // console.log("useForm:" + fields)
   const form = ref({ ...fields });
   const isEditing = ref(false);

   const editModalVisible = ref(false);

   const loading = ref(false);
   const fieldErrors = ref({});
   const formError = ref('');

   const selectedToDelete = ref({});
   const deleteModalVisible = ref(false);

   // computed() para ser reativo com o Pinia
   const globalEventoId = computed(() => eventStore.currentEvent?.id || '');
   

   async function load(id = 0) {
      try {
         loading.value = true;

         const res = await api.get(`${endpoint}/${id}`,{
            params: {
               evento_id: globalEventoId.value,    // sempre envia o evento_id por imposição da regra do negócio
            }
         });

         // carrega os dados do load do response para o form Modal 1 para 1 nos fields substituindo todos         
         // form.value = { ...fields, ...res.data };  

         // carrega os dados do load para o form Modal substituindo apenas os fields novos do response e mantendo os demais do defaultValues
         form.value = {
            ...toRaw(defaultValues), // copia profunda dos padrões
            ...res.data
         };         


         // @@ Chamar callback onLoaded se existir
         if (onLoaded) {
            onLoaded(form.value);
         }         

         isEditing.value = id ?? false; // controle se é edição ou novo registro
         formError.value = ''; // limpa o form errors
         clearFieldErrors(); // limpa o filds errors
         editModalVisible.value = true; // mostra o modal
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
      // console.log('Reiniciando form com valores padrão:', defaultValues);

      form.value = { ...defaultValues };
      // console.log('Form após reset:', form.value);
      isEditing.value = false;
      formError.value = '';
      clearFieldErrors();
   }

   async function insertNewModal() {
      clearFieldData(); // limpa dos campos
      // TODO
      // o load()  abaixo está sobrescrevendo os valores do defaultValues
      // porém, há Endpoints que precisam carregar dados adicionais para os selects
      // resolver isso depois
      await load(); // carrega os dados necessárioas ao form para o novo registro (listas)
      editModalVisible.value = true;
   }

   function closeModal() {
      editModalVisible.value = false;
      clearFieldData();
   }

   async function print() {
      // console.log('print', globalEventoId.value);

      try {
         // const response = await api.get(`/hotel/relatorio/${globalEventoId.value}`, {
         const response = await api.get(`/hotel/relhospedagemdoevento/${globalEventoId.value}`, {
            responseType: 'blob',
         });

         const blob = new Blob([response.data], { type: 'application/pdf' });
         const url = window.URL.createObjectURL(blob);
         window.open(url, '_blank');
         window.URL.revokeObjectURL(url); // Liberar URL da memória

         showToast({
            title: 'Sucesso',
            message: `Relatório gerado com sucesso.`,
         });
      } catch (error) {
         console.log('useForm: Erro ao gerar relatório:', error.response?.data.message);
      }      
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
      } catch (error) {
         // if (error.response?.status === 400) {
         //    console.log(error.response.data.message);
         // }
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
            await api.put(`${endpoint}/${form.value.id}`, form.value);  // PUT update
         } else {
            await api.post(endpoint, form.value);                       // POST insert 
         }

         editModalVisible.value = false;
         onSaved?.();
      } catch (error) {
         if (error.response?.status === 422) {
            fieldErrors.value = error.response.data.errors || {};
            // console.log(fieldErrors.value);
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
      onLoaded,  // ← ADICIONAR ESTA LINHA
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
