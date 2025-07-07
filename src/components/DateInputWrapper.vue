<!-- DateInputWrapper.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
   modelValue: {
      type: String,
      default: '',
   },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
   get() {
      // Pega só a parte da data, os primeiros 10 caracteres
      return props.modelValue ? props.modelValue.slice(0, 10) : '';
   },
   set(val) {
      // Ao mudar, adiciona a hora fixa "00:00:00" e emite a atualização para o pai
      emit('update:modelValue', val ? `${val} 00:00:00` : '');
   },
});
</script>

<template>
   <input class="form-control" type="date" v-model="inputValue" />
</template>
