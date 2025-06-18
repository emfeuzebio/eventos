<template>
    <CToaster placement="top-end" class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <CToast
        v-for="toast in toasts"
        :key="toast.id"
        :autohide="toast.autohide"
        :delay="toast.delay"
        :visible="true"
        :color="toast.color"
        @hide="removeToast(toast.id)"
      >

      <!-- Título com fundo colorido -->
      <CToastHeader :class="`bg-${toast.color} text-white`">
        <b>{{ toast.title || 'Aviso' }}</b>
      </CToastHeader>

      <!-- Corpo do toast com texto colorido simples -->
      <CToastBody :class="`bg-white text-${toast.color}`">
        {{ toast.message || 'Sem mensagem' }}
      </CToastBody>      

      </CToast>
    </CToaster>
  </template>
  
  <script setup>
  import { useToast } from '@/composables/useToast'
  
  const { toasts, removeToast } = useToast()
  </script>
  