<script setup>
import { computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';

// define a Entidade Principal da View
const entity = 'veiculo';

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const { abilities } = useAbilities();

// Permissões específicas para a entidade "veiculo"
const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro

var canPrint = can(`${entity}.print`);
var canPrint = true;

// DEBUG de todas abilities do User Logado
console.log('Abilities carregadas:', abilities.value);
console.log('canList:', canList); // Isso deve ser true ou false
console.log('canShow:', canShow); // Isso deve ser true ou false
console.log('canInsert:', canInsert); // Isso deve ser true ou false
console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
console.log('canDelete:', canDelete); // Isso deve ser true ou false
console.log('canPrint:', canPrint); // Isso deve ser true ou false

// define parâmetros das tabela de dados
const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Descrição do Veículo', data: 'descricao', class: 'fw-bold' },
   { title: 'Tipo', data: 'tipo' },
   {
      title: 'Capacidade',
      data: 'capacidade',
      render: (data) => `${data} p`,
      className: 'text-center',
   },
   { title: 'Motorista', data: 'motorista' },
   {
      title: 'Ativo',
      data: 'ativo',
      class: 'dt-center small',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'Y' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'Y' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
];

// define os valores padrão dos campos do formulário
const defaultValues = {
   descricao: 'Carro cor 2 lugares do José',
   tipo: 'Automóvel',
   marca_modelo: 'Deconhecido',
   capacidade: '3',
   motorista: 'Sem Nome',
   telefone: '(61) 90000-0000',
   ativo: 'Y',
};

// filtro da página - usar quando não há filtros
// const filters = [{}]; // nessse caso sem filtros

// monta lista de tipos de veículos para o filtro
const tipoVeiculo = [
   { value: '', label: 'Selecione o tipo' },
   { value: 'Automóvel', label: 'Automóvel' },
   { value: 'Van', label: 'Van' },
   { value: 'Micrônibus', label: 'Micrônibus' },
   { value: 'Ônibus', label: 'Ônibus' },
];

// Filtros da Página com valores fixos - filtro reativo aos dados carregados
const filters = computed(() => [
   {
      label: 'Tipo de Veículo',
      field: 'tipo',
      type: 'select',
      options: tipoVeiculo.map((tipo) => ({
         value: tipo.value,
         label: tipo.label,
      })),
   },
]);
</script>

<template>
   <GenericCrud
      title="Cadastro de Veículos"
      description="Gerenciamento da frota de Veículos"
      endpoint="veiculo"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :abilities="abilities"
      :canList="canList"
      :canShow="canShow"
      :canInsert="canInsert"
      :canUpdate="canUpdate"
      :canDelete="canDelete"
      :canPrint="canPrint"
   >
      <template #form="{ form, errors }">
         <CFormInput
            v-model="form.value.descricao"
            label="Descrição"
            :class="{ 'is-invalid': errors.descricao }"
         />
         <div class="form-error" v-if="errors.value.descricao">
            {{ errors.value.descricao[0] }}
         </div>

         <CFormInput
            v-model="form.value.tipo"
            label="Tipo"
            :class="{ 'is-invalid': errors.tipo }"
         />
         <div class="form-error" v-if="errors.value.tipo">
            {{ errors.value.tipo[0] }}
         </div>

         <CFormInput
            v-model="form.value.marca_modelo"
            label="Marca/Modelo"
            :class="{ 'is-invalid': errors.marca_modelo }"
         />
         <div class="form-error" v-if="errors.value.marca_modelo">
            {{ errors.value.marca_modelo[0] }}
         </div>

         <CFormInput
            v-model="form.value.capacidade"
            label="Capacidade"
            :class="{ 'is-invalid': errors.capacidade }"
         />
         <div class="form-error" v-if="errors.value.capacidade">
            {{ errors.value.capacidade[0] }}
         </div>

         <CFormInput
            v-model="form.value.motorista"
            label="Motorista"
            :class="{ 'is-invalid': errors.motorista }"
         />
         <div class="form-error" v-if="errors.value.motorista">
            {{ errors.value.motorista[0] }}
         </div>

         <CFormInput
            v-model="form.value.telefone"
            label="Telefone"
            :class="{ 'is-invalid': errors.telefone }"
         />
         <div class="form-error" v-if="errors.value.telefone">
            {{ errors.value.telefone[0] }}
         </div>

         <CFormInput
            v-model="form.value.observacao"
            label="Observação"
            :class="{ 'is-invalid': errors.observacao }"
         />
         <div class="form-error" v-if="errors.value.observacao">
            {{ errors.value.observacao[0] }}
         </div>

         <CFormSelect
            v-model="form.value.ativo"
            :options="[
               { value: 'Y', label: 'SIM' },
               { value: 'N', label: 'NÃO' },
            ]"
            label="Ativo"
         />
         <div class="form-error" v-if="errors.value.ativo">
            {{ errors.value.ativo[0] }}
         </div>
      </template>
   </GenericCrud>
</template>
