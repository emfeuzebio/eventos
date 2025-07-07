<script setup>
import { computed } from 'vue';

const props = defineProps({
   modelValue: {
      type: String,
      default: '',
   },
});

const emit = defineEmits(['update:modelValue']);

// Recebe da API padrão ISO 8601 Fuso UTC-0
// e Converte para hora local do navegador
function formatToInput(value) {
   if (!value) return '';

   // 🧼 Limpa frações de segundos (.000000Z → Z)
   const cleanedValue = value.replace(/\.\d{3,6}Z$/, 'Z');

   // ✅ Usa Date sem mexer no timezone (interpreta como UTC)
   const date = new Date(cleanedValue);
   var dateLocal = '';

   // ✅ Extrai hora local (para mostrar no input)
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');

   dateLocal = `${year}-${month}-${day}T${hours}:${minutes}`; // formato para datetime-local
   console.log('formatToInput', dateLocal);

   return dateLocal;
}

// ✅ Converte hora local para UTC ISO
// function formatToSave(value) {
//    if (!value) return '';
//    const date = new Date(value);
//    return date.toISOString(); // UTC + 'Z'
// }

// Mantém a hora local sem embutir o UTC-0
function formatToSave(value) {
   console.log('formatToSave', value);
   return value || ''; // já está no formato local aceito: 'YYYY-MM-DDTHH:mm'
}

const inputValue = computed({
   get() {
      return formatToInput(props.modelValue); // mostra em horário local
   },
   set(val) {
      emit('update:modelValue', formatToSave(val)); // salva em UTC
   },
});
</script>

<template>
   <!-- <input class="form-control" type="datetime-local" v-model="inputValue" />     -->

   <input
      class="form-control"
      type="datetime-local"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
   />
</template>
