<template>
   <div>
      <h3>{{ title }}</h3>

      <div class="alert alert-info d-flex align-items-center mt-3" role="alert">
         <i class="fas fa-hard-hat me-2"></i>
         <div>
            <strong>Página em construção!</strong>
            Este módulo está sendo desenvolvido e será aprimorado conforme o
            site evolui.
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CContainer, CRow, CCol } from '@coreui/vue';

const title = ref('Dashboard da Gestão de Eventos');

onMounted(() => {
   // Lógica inicial
});
</script>

<style scoped></style>
