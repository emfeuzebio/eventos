<template>
   <Multiselect 
      v-bind="$attrs" 
      class="multiselect-coreui" 
      searchable 
      placeholder="Selecione..."
   />
</template>

<script setup>
// https://vue-multiselect.js.org/#sub-select-with-search
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
</script>

<style>
/* Estilos customizado para harmonizr com CoreUI */
.multiselect-coreui {
   --ms-font-size: var(--cui-body-font-size);
   /* --ms-line-height: var(--cui-line-height-base); */
   line-height: 1;
   --ms-font-family: var(--cui-body-font-family);
   --ms-bg: var(--cui-body-bg);
   --ms-border-color: var(--cui-border-color);
   --ms-border-width: 1px;
   --ms-radius: var(--cui-border-radius);
   --ms-placeholder-color: var(--cui-input-placeholder-color);
   --ms-ring-color: rgba(var(--cui-primary-rgb), 0.25); /* Sombra roxa */

   --ms-dropdown-bg: var(--cui-body-bg);
   --ms-dropdown-border-color: var(--cui-border-color);
   --ms-dropdown-border-width: 1px;

   --ms-option-bg-pointed: var(--cui-primary);
   --ms-option-color-pointed: white;
   --ms-option-bg-selected: var(--cui-primary);
   --ms-option-color-selected: white;

   --ms-tag-bg: var(--cui-primary);
   --ms-tag-color: white;

   --ms-spinner-color: var(--cui-primary);
}

/* Estado de foco */
.multiselect-coreui.is-active {
   --ms-border-color-active: var(--cui-primary); /* Roxo do CoreUI */
   box-shadow: 0 0 0 0.25rem rgba(var(--cui-primary-rgb), 0.25);
}

/* Estados de validação */
.multiselect-coreui.is-invalid {
   --ms-border-color: var(--cui-danger);
   --ms-border-color-active: var(--cui-danger);
}

.multiselect-coreui.is-valid {
   --ms-border-color: var(--cui-success);
   --ms-border-color-active: var(--cui-success);
}

/* Ajustes específicos */
.multiselect-coreui .multiselect-tag-remove:after {
   color: white;
}

.multiselect-coreui .multiselect-tag-remove:hover {
   background: rgba(0, 0, 0, 0.1);
}

/* Sobrescreve o focus padrão (verde) */
.multiselect-coreui:focus-within {
   border-color: var(--cui-primary) !important;
   box-shadow: 0 0 0 0.25rem rgba(var(--cui-primary-rgb), 0.25) !important;
}

/* Ajuste para o input interno */
.multiselect-coreui .multiselect-input {
   padding-top: 0.375rem !important;
   padding-bottom: 0.375rem !important;
}

/* Ajuste para modo single select */
.multiselect-coreui .multiselect-single {
   padding-top: 0.375rem !important;
   padding-bottom: 0.375rem !important;
}

/* Ajuste para modo múltiplo com tags */
.multiselect-coreui .multiselect-tags {
   padding-top: 0.125rem !important;
   padding-bottom: 0.125rem !important;
}

.multiselect-coreui {
   /* Reset completo da altura */
   --ms-py: 6px !important;
   --ms-px: 12px !important;
   min-height: auto !important;
}

.multiselect-coreui .multiselect-inner {
   min-height: 38px !important;
   padding: 0.375rem 0.75rem !important;
}

.multiselect-coreui .multiselect-option {
   padding-top: 0.375rem;     /* igual a Bootstrap 0.375rem (~6px) */
   padding-bottom: 0.375rem;
   padding-left: 0.75rem;     /* como os selects padrão */
   padding-right: 0.75rem;
   font-size: var(--cui-body-font-size);
   /* line-height: var(--cui-line-height-base); */
   line-height: 1;
}

.multiselect-coreui .multiselect-option.is-selected::after {
   margin-top: 0.125rem; /* alinhamento vertical do ícone */
}


/* Escopo do multiselect com classe personalizada */
.multiselect-coreui {
  --ms-option-selected-bg: #e9ecef; /* cinza claro Bootstrap */
  --ms-option-selected-color: #212529; /* texto padrão */
  --ms-option-hover-bg: #e7eaee; /* hover cinza clarinho */
  --ms-ring-color: transparent; /* remove o anel roxo */
  --ms-border-color-active: #86b7fe; /* azul Bootstrap */
  --ms-border-color: #ced4da; /* borda padrão */
  --ms-dropdown-border-color: #ced4da;
  --ms-dropdown-box-shadow: none; /* remove sombra roxa */
}

/* Corrige hover da opção ao navegar */
.multiselect-coreui .multiselect-option.is-pointed {
  background-color: var(--ms-option-hover-bg);
  color: var(--ms-option-hover-color);
}

.multiselect-coreui .multiselect-dropdown .multiselect-options {
  max-height: 600px !important;
}

</style>
