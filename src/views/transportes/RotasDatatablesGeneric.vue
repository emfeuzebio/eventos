<script setup>

import GenericCrud from '@/components/GenericCrud.vue'

const columns = [
  { title: 'ID', data: 'id' },
  { title: 'Descrição', data: 'descricao' },
  { title: 'Tipo', data: 'tipo' },
  { title: 'Motorista', data: 'motorista' },
]

const defaultValues = {
  descricao: '',
  tipo: '',
  motorista: '',
}
</script>

<template>
  <GenericCrud
    title="Veículos"
    description="Gerenciamento da frota"
    endpoint="veiculo"
    :columns="columns"
    :default-values="defaultValues"
    :canInsert="true"
    :canUpdate="false"
    :canDelete="true"
  >
    <template #form="{ form, errors }">
      <CFormInput v-model="form.descricao" label="Descrição" :class="{ 'is-invalid': errors.descricao }" />
      <div class="invalid-feedback">{{ errors.descricao }}</div>

      <CFormInput v-model="form.tipo" label="Tipo" :class="{ 'is-invalid': errors.tipo }" />
      <div class="invalid-feedback">{{ errors.tipo }}</div>

      <CFormInput v-model="form.motorista" label="Motorista" />
    </template>
  </GenericCrud>
</template>
