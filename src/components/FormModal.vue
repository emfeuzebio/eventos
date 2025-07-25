<template>
   <CModal
      :visible="visible"
      @close="$emit('close')"
      backdrop="static"
      fullscreen
   >
      <CModalHeader>
         <CModalTitle>{{ title }}</CModalTitle>
      </CModalHeader>

      <CModalBody>
         <!-- visible: {{ visible }} <br /> -->
         <CForm>
            <CRow class="mb-3 align-items-center">
               <CCol sm="4">
                  <CFormLabel>Chegada Meio Transporte:</CFormLabel>
               </CCol>
               <CCol sm="8">
                  <CFormInput
                     id="nome"
                     v-model="formData.chegada_meio_transp"
                     type="text"
                     placeholder="Digite"
                     class="form-control"
                  />
                  <div class="form-error" v-if="formError.chegada_meio_transp">
                     {{ formError.chegada_meio_transp[0] }}
                  </div>
               </CCol>

               <CRow class="mb-3 align-items-center">
                  <CCol sm="4">
                     <CFormLabel for="categoria">modalidade:</CFormLabel>
                  </CCol>
                  <CCol sm="8">
                     <CFormSelect
                        id="categoria"
                        v-model="formData.modalidade"
                        class="form-control"
                     >
                        <option disabled value="">
                           Selecione uma modalidade
                        </option>
                        <option value="Presencial">Presencial</option>
                        <option value="Virtual">Virtual</option>
                     </CFormSelect>
                     <div class="form-error" v-if="formError.modalidade">
                        {{ formError.modalidade[0] }}
                     </div>
                  </CCol>
               </CRow>

               <CRow class="mb-3 align-items-center">
                  <CCol sm="4">
                     <CFormLabel>Observações:</CFormLabel>
                  </CCol>
                  <CCol sm="8">
                     <CFormTextarea
                        id="descricao"
                        v-model="formData.observacao"
                        rows="3"
                        placeholder="Descreva aqui..."
                     />
                     <div class="form-error" v-if="formError.observacao">
                        {{ formError.observacao[0] }}
                     </div>
                  </CCol>
               </CRow>
            </CRow>
         </CForm>
         <!-- {{ conteudo }} <br /> -->
         <!-- formData: {{ formData }} -->
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
import { onMounted } from 'vue';

const props = defineProps({
   visible: Boolean,
   title: String,
   conteudo: String,
   formData: Object,
   formError: Object,
});
const emit = defineEmits(['close', 'save', 'destroy']);

function submitForm() {
   //    emit('save', { nome: 'Teste', email: 'teste@example.com' });
   //    emit('destroy', {});
   emit('save', { ...props.formData });
}

onMounted(()=>{
})
</script>
