<template>
  <CToaster
    placement="top-end"
    class="position-fixed top-0 end-0 p-3"
    style="z-index: 9999"
  >
    <CToast
      v-for="toast in toasts"
      :key="toast.id"
      :autohide="toast.autohide"
      :delay="toast.delay"
      :visible="true"
      :color="toast.color"
      class="border-0 shadow-sm"
      @hide="removeToast(toast.id)"
    >
      <!-- Título com fundo colorido e ícone do tipo -->
      <CToastHeader :class="`bg-${toast.color} text-white`">
        <i
          v-if="toast.icon"
          :class="[toast.icon, 'me-2']"
          aria-hidden="true"
        ></i>
        <b>{{ toast.title || 'Aviso' }}</b>
      </CToastHeader>

      <!-- Corpo do toast: sempre legível, independente da cor do tipo -->
      <CToastBody class="bg-white text-dark">
        <span v-html="toast.message || 'Sem mensagem'"></span>
      </CToastBody>
    </CToast>
  </CToaster>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>