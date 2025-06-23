<script setup>
import { computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';

import { useEventos } from '@/composables/useEventos';
const { fetchEstados, estados } = useEventos();

// define a Entidade Principal da View
const entity = 'estado';

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
var canPrint = false;

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
   { title: 'Sigla', data: 'sigla' },
   { title: 'Nome do Estado', data: 'descricao', class: 'fw-bold' },
   {
      title: 'Região',
      data: 'regiao.descricao',
      render: (data) => `${data} `,
      className: 'text-left',
   },

];

// define os valores padrão dos campos do formulário
const defaultValues = {
   regiao_id: null,
   sigla: 'Sigla',
   descricao: 'Descrição',
};

// carrega listas de estidades da API para popular listas: <selects> os filtros
fetchEstados();

// filtro da página - usar quando não há filtros
const filters = [{}]; // nessse caso sem filtros

// Filtros da Página com valores fixos - filtro reativo aos dados carregados
// const filters = computed(() => [
//    {
//       label: 'Estado',
//       field: 'estado_id',
//       type: 'select',
//       options: estados.value.map((estado) => ({
//          value: estado.id,
//          label: estado.descricao,
//       })),
//    },
// ]);
</script>

<template>
   <!-- {{ rotas }} -->
   <!-- {{ eventos }} -->

   <GenericCrud
      title="Cadastro de Estados "
      description="Gerenciamento do cadastro de Estados da Federação"
      endpoint="estado"
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
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->

         <label class="form-label fw-bold">Região do País</label>
         <CFormSelect
            v-model="form.value.regiao_id"
            :options="[
               { value: '', label: 'Selecione' },
               ...estados.map((estado) => ({
                  value: estado.id,
                  label: estado.descricao,
               })),
            ]"
         />
         <div class="form-error" v-if="errors.value.regiao_id">
            {{ errors.value.regiao_id[0] }}
         </div>

         <label class="form-label fw-bold">Nome do Estado da Federação</label>
         <CFormInput
            v-model="form.value.descricao"
            :class="{ 'is-invalid': errors.descricao }"
         />
         <div class="form-error" v-if="errors.value.descricao">
            {{ errors.value.descricao[0] }}
         </div>

         <label class="form-label fw-bold">Sigla</label>
         <CFormInput
            v-model="form.value.sigla"
            :class="{ 'is-invalid': errors.sigla }"
         />
         <div class="form-error" v-if="errors.value.sigla">
            {{ errors.value.sigla[0] }}
         </div>
      </template>
   </GenericCrud>
</template>
