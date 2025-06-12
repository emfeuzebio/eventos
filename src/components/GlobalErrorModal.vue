<template>
  <!-- Erros Global Modal -->
  <CModal :visible="visible" @close="close" size="sm" centered keyboard="true">
    <CModalHeader class="bg-danger text-white">
      <CModalTitle>
        <CIcon name="cil-warning" class="me-2" />Erro
      </CModalTitle>
    </CModalHeader>

    <CModalBody class="text-danger fs-6">
      <div class="d-flex align-items-center">
        <CIcon name="cil-ban" style="transform: scale(3.5);" class="me-4 text-danger" />
        <span>{{ message }}</span>
      </div>
    </CModalBody>

    <CModalFooter>
      <CButton color="btn btn-outline-danger btn-sm" @click="close">Fechar</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { useGlobalError } from '@/composables/useGlobalError'
import { CIcon } from '@coreui/icons-vue'

const { visible, message, close } = useGlobalError()
</script>
