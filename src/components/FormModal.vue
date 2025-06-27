<template>
   <CModal :visible="visible" @close="$emit('close')" backdrop="static">
      <CModalHeader>
         <CModalTitle>{{ title }}</CModalTitle>
      </CModalHeader>

      <CModalBody>
         <CForm> Componente de formulário aqui! </CForm>
         visible: {{ visible }} <br />
         {{ conteudo }}

         {{ formData }}
      </CModalBody>

      <CModalFooter>
         <CButton color="secondary" size="sm" @click="$emit('close')"
            >Cancelar</CButton
         >
         <CButton color="primary" size="sm" @click="submitForm">Salvar</CButton>
      </CModalFooter>
   </CModal>
</template>

<script setup>
const props = defineProps({
   visible: Boolean,
   title: String,
   conteudo: String,
   formData: Object,
});
const emit = defineEmits(['close', 'save', 'destroy']);

function submitForm() {
   //   let valid = true
   //   Object.keys(errors).forEach((k) => (errors[k] = null))

   //   for (const field of props.fields) {
   //     if (field.required && !formData[field.name]) {
   //       errors[field.name] = 'Este campo é obrigatório'
   //       valid = false
   //     }
   //   }

   //   if (valid) emit('save', { ...formData })
   emit('save', { nome: 'Teste', email: 'teste@example.com' });
   emit('destroy', {});
}
</script>
