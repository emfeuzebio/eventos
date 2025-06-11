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
      <CFormInput v-model="form.value.descricao" label="Descrição" :class="{ 'is-invalid': errors.descricao }" />
      <div class="invalid-feedback">{{ errors.descricao }}</div>

      <CFormInput v-model="form.value.tipo" label="Tipo" :class="{ 'is-invalid': errors.tipo }" />
      <div class="invalid-feedback">{{ errors.tipo }}</div>

      <CFormInput v-model="form.value.marca_modelo" label="Marca/Modelo" :class="{ 'is-invalid': errors.marca_modelo }" />
      <div class="invalid-feedback">{{ errors.marca_modelo }}</div>

      <CFormInput v-model="form.value.capacidade" label="Capacidade" :class="{ 'is-invalid': errors.capacidade }" />
      <div class="invalid-feedback">{{ errors.capacidade }}</div>

      <CFormInput v-model="form.value.motorista" label="Motorista" :class="{ 'is-invalid': errors.motorista }" />
      <div class="invalid-feedback">{{ errors.motorista }}</div>

      <CFormInput v-model="form.value.telefone" label="Telefone" :class="{ 'is-invalid': errors.telefone }" />
      <div class="invalid-feedback">{{ errors.telefone }}</div>

      <CFormInput v-model="form.value.observacao" label="Observação" :class="{ 'is-invalid': errors.observacao }" />
      <div class="invalid-feedback">{{ errors.observacao }}</div>

      <CFormSelect v-model="form.value.ativo" :options="[{ value: 'Y', label: 'SIM' }, { value: 'N', label: 'NÃO' }]" label="Ativo" />

    </template>
  </GenericCrud>
</template>
