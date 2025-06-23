<script setup>
import { computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';

import { useEventos } from '@/composables/useEventos';
const {
   eventos,
   fetchEventos,
   fetchRotas,
   fetchEstados,
   estados,
   rotas,
   loading,
   error,
} = useEventos();

// define a Entidade Principal da View
const entity = 'funcaos';

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
   { title: 'Descrição', data: 'descricao', class: 'fw-bold', width: '460px' },
   { title: 'Sigla', data: 'sigla', width: '100px' },
   { title: 'Qtd', data: 'qtd', class: 'dt-center small', },
   { title: 'Exclusivo FEB', data: 'exclusivo_feb', class: 'dt-center small', },
   {
      title: 'Ativo',
      data: 'ativo',
      class: 'dt-center small',
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   // { title: 'Destino', data: 'destino' },
   // {
   //    title: 'Qtd Viagens',
   //    data: null,
   //    render: (data) => `?`,
   //    className: 'text-center',
   // },
   // {
   //    title: 'Ativo',
   //    data: 'ativo',
   //    render: (data) => (data === 'SIM' ? 'SIM' : 'NÃO'),
   //    className: 'text-center',
   // },
];

// define os valores padrão dos campos do formulário
const defaultValues = {
   evento_id: '1',
   nome: 'Nome',
   sigla: 'Sigla',
   descricao: 'Descrição',
   ativo: 'SIM',
};

// carrega listas de estidades da API para popular listas: <selects> os filtros
// fetchEventos();
fetchEstados();

// filtro da página - usar quando não há filtros
const filters = [{}]; // nessse caso sem filtros

</script>

<template>
   <!-- {{ rotas }} -->
   <!-- {{ eventos }} -->

   <GenericCrud
      title="Lista de Funções "
      description="Gerenciamento das Funções/Papéis da Pessoas inscritas no Evento"
      endpoint="funcaos"
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

         <label class="form-label fw-bold">Nome</label>
         <CFormInput
            v-model="form.value.nome"
            :class="{ 'is-invalid': errors.nome }"
         />
         <div class="form-error" v-if="errors.value.nome">
            {{ errors.value.nome[0] }}
         </div>

         <label class="form-label fw-bold">Sigla</label>
         <CFormInput
            v-model="form.value.sigla"
            :class="{ 'is-invalid': errors.sigla }"
         />
         <div class="form-error" v-if="errors.value.sigla">
            {{ errors.value.sigla[0] }}
         </div>

         <label class="form-label fw-bold">Descrição</label>
         <CFormInput
            v-model="form.value.descricao"
            :class="{ 'is-invalid': errors.descricao }"
         />
         <div class="form-error" v-if="errors.value.descricao">
            {{ errors.value.descricao[0] }}
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
