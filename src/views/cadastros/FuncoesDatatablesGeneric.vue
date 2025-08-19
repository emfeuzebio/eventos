<script setup>
import { computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';

import { useEventos } from '@/composables/useEventos';
const { fetchEstados, estados, loading, error } = useEventos();

// define a Entidade Principal da View
const entity = 'funcao';

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
// console.log('Abilities carregadas:', abilities.value);
// console.log('canList:', canList); // Isso deve ser true ou false
// console.log('canShow:', canShow); // Isso deve ser true ou false
// console.log('canInsert:', canInsert); // Isso deve ser true ou false
// console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
// console.log('canDelete:', canDelete); // Isso deve ser true ou false
// console.log('canPrint:', canPrint); // Isso deve ser true ou false

// define parâmetros das tabela de dados
const columns = [
   { title: 'ID', data: 'id', width: '30px' },
   {
      title: 'Nome da Função',
      data: 'descricao',
      class: 'fw-bold',
      width: 'auto',
   },
   { title: 'Sigla', data: 'sigla', width: '150px' },
   { title: 'Qtd Máx', data: 'qtd', width: '100px', className: 'text-center' },
   {
      title: 'Exclusivo FEB',
      data: 'exclusivo_feb',
      class: 'dt-center small',
      width: '130px',
      className: 'text-center',
   },
   {
      title: 'Ativo',
      data: 'ativo',
      class: 'dt-center small',
      className: 'text-center',
      width: '60px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
];

// define os valores padrão dos campos do formulário
const defaultValues = {
   descricao: '',
   sigla: '',
   qtd: '1',
   exclusivo_feb: 'NÃO',
   ativo: 'SIM',
};

// carrega listas de estidades da API para popular listas: <selects> os filtros
// fetchEstados();

// filtro da página - usar quando não há filtros
const filters = [{}]; // nessse caso sem filtros
</script>

<template>
   <!-- {{ eventos }} -->

   <GenericCrud
      title="Cadastro de Funções "
      description="Gerenciamento das Funções/Papéis de Pessoas inscritas em um Evento"
      endpoint="funcao"
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

         <label class="form-label fw-bold">Nome da Função</label>
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

         <label class="form-label fw-bold">Quantidade Máxima por Evento</label>
         <CFormInput
            v-model="form.value.qtd"
            :class="{ 'is-invalid': errors.qtd }"
         />
         <div class="form-error" v-if="errors.value.qtd">
            {{ errors.value.qtd[0] }}
         </div>

         <label class="form-label fw-bold">Exclusivo da FEB</label>
         <CFormSelect
            v-model="form.value.exclusivo_feb"
            :options="[
               { value: 'SIM', label: 'SIM' },
               { value: 'NÃO', label: 'NÃO' },
            ]"
         />
         <div class="form-error" v-if="errors.value.exclusivo_feb">
            {{ errors.value.exclusivo_feb[0] }}
         </div>

         <label class="form-label fw-bold">Ativo</label>
         <CFormSelect
            v-model="form.value.ativo"
            :options="[
               { value: 'SIM', label: 'SIM' },
               { value: 'NÃO', label: 'NÃO' },
            ]"
         />
         <div class="form-error" v-if="errors.value.ativo">
            {{ errors.value.ativo[0] }}
         </div>
      </template>
   </GenericCrud>
</template>
