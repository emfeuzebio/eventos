<template>
   <!-- Erros Global Modal -->
   <CModal :visible="visible" @close="close" class="modal-erro modal-fullscreen-sm-down">
      <CModalHeader class="bg-danger text-white">
         <CModalTitle>
            Erro!
         </CModalTitle>
      </CModalHeader>
      
      <CModalBody class="text-danger fs-6">
         <div class="d-flex align-items-center flex-wrap">
         <p class="flex-grow-1 m-0" v-html="message"></p>
         </div>
      </CModalBody>

      <CModalFooter>
         <CButton color="btn btn-outline-danger btn-sm" @click="close"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { useGlobalError } from '@/composables/useGlobalError';
import { CIcon } from '@coreui/icons-vue';

const { visible, message, close } = useGlobalError();
</script>
