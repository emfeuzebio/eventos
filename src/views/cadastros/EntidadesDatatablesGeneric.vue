<script setup>
import { computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useEventos } from '@/composables/useEventos';

// import DataTable from 'datatables.net-vue3';
import DataTablesLib from 'datatables.net-bs5';

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
const entity = 'entidade';

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const { abilities } = useAbilities();

// Permissões específicas para a entidade "veiculo"
// const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
// const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
// const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
// const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
// const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro

// var canPrint = can(`${entity}.print`);
// var canPrint = true;

// DEBUG de todas abilities do User Logado
// console.log('Abilities carregadas:', abilities.value);

// define parâmetros das tabela de dados
const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Nome', data: 'nome', class: 'fw-bold', width: '460px' },
   { title: 'Sigla', data: 'sigla', width: '100px' },
   // { title: 'Descrição', data: 'descricao' },
   { title: 'Telefone', data: 'telefone1', width: '120px' },
   {
      title: 'Ativo',
      data: 'ativo',
      class: 'dt-center small',
      width: '70px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   // {
   //    title: 'Origem',
   //    data: 'origem',
   //    render: (data) => `${data} `,
   //    className: 'text-left',
   // },
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
// const filters = [{}]; // nessse caso sem filtros

// Filtros da Página com valores fixos - filtro reativo aos dados carregados
const filters = computed(() => [
   {
      label: 'Estado',
      field: 'estado_id',
      type: 'select',
      options: estados.value.map((estado) => ({
         value: estado.id,
         label: estado.descricao,
      })),
   },
]);
</script>

<template>
   <!-- {{ rotas }} -->
   <!-- {{ eventos }} -->

   <GenericCrud
      title="Lista de Entidades "
      description="Gerenciamento de Entidades Espíritas"
      endpoint="entidade"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :abilities="abilities"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->
         <!-- {{ eventos }} -->
         <!-- {{ rotas }} -->
         <!-- {{ form.value }} -->

         <label class="form-label fw-bold">Estado da Federação</label>
         <CFormSelect
            v-model="form.value.estado_id"
            :options="[
               { value: '', label: 'Selecione' },
               ...estados.map((estado) => ({
                  value: estado.id,
                  label: estado.descricao,
               })),
            ]"
         />
         <div class="form-error" v-if="errors.value.estado_id">
            {{ errors.value.estado_id[0] }}
         </div>

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
