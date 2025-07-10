<script setup>
import { onBeforeMount } from 'vue';
import { useColorModes } from '@coreui/vue';

import { useThemeStore } from '@/stores/theme.js';
import GlobalErrorModal from '@/components/GlobalErrorModal.vue';
import GlobalToast from '@/components/GlobalToast.vue';

import { useGlobalLoading } from '@/stores/loading';
import { CSpinner } from '@coreui/vue';

import 'font-awesome/css/font-awesome.min.css';

const { globalLoading } = useGlobalLoading();
// const { toasts, removeToast } = useToast()

const { isColorModeSet, setColorMode } = useColorModes(
   'coreui-free-vue-admin-template-theme'
);
const currentTheme = useThemeStore();

onBeforeMount(() => {
   const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
   let theme = urlParams.get('theme');

   if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
      theme = theme.match(/^[A-Za-z0-9\s]+/)[0];
   }

   if (theme) {
      setColorMode(theme);
      return;
   }

   if (isColorModeSet()) {
      return;
   }

   setColorMode(currentTheme.theme);
});
</script>

<template>
   <div v-if="globalLoading" class="global-loader">
      <CSpinner color="primary" />
   </div>
   <router-view />
   <GlobalErrorModal />
   <GlobalToast />
</template>

<style scoped>
.global-loader {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(255, 255, 255, 0.1);
   z-index: 9999;
   display: flex;
   align-items: center;
   justify-content: center;
}
</style>

<style lang="scss">
// Import Main styles for this application
@use 'styles/style';
// We use those styles to show code examples, you should remove them in your application.
@use 'styles/examples';

/* Remover bordas fortes entre linhas */
table.dataTable.table-borderless > tbody > tr > td {
   border-top: none;
}

/* Alterar cor de fundo do cabeçalho para combinar com CoreUI */
table.dataTable thead th {
   background-color: var(--cui-bg-light);
   color: var(--cui-text-color);
   border-bottom: 1px solid var(--cui-border);
}

/* Estilizar paginação com cores CoreUI */
.dataTables_wrapper .pagination .page-link {
   color: var(--cui-link-color);
}
.dataTables_wrapper .pagination .page-item.active .page-link {
   background-color: var(--cui-primary);
   border-color: var(--cui-primary);
}

/* Ajustar elementos de busca e length */
.dataTables_length select,
.dataTables_filter input {
   padding: 0.375rem 0.75rem;
   border: 1px solid var(--cui-border);
   border-radius: 0.25rem;
}

/* Botões export */
.dt-buttons .btn {
   margin-right: 0.375rem;
   color: var(--cui-white);
   background-color: var(--cui-primary);
   border: none;
}
</style>
