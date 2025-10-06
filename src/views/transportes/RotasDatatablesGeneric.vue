<script setup>
import { computed, ref } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import DataTablesLib from 'datatables.net-bs5';

import { useEventos } from '@/composables/useEventos';
const { eventos, fetchEventos, fetchRotas, rotas, loading, error } =
   useEventos();

// Vamos obter a lista de Eventos Ativo e o Corrente do store
import { useCurrentEventStore } from '@/stores/currentEvent';
const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);
const glbventosAtivos = computed(() => eventosStore.ativos);
// console.log('Eventos Ativos:', glbventosAtivos);
// console.log('Eventos Corrente:', currentEvent.value?.id || 'Não selecionado');

// define a Entidade Principal da View
const entity = 'rota';

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
// console.log('canList:', canList); // Isso deve ser true ou false
// console.log('canShow:', canShow); // Isso deve ser true ou false
// console.log('canInsert:', canInsert); // Isso deve ser true ou false
// console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
// console.log('canDelete:', canDelete); // Isso deve ser true ou false
// console.log('canPrint:', canPrint); // Isso deve ser true ou false

// define parâmetros das tabela de dados
const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Nome da Rota', data: 'nome', class: 'fw-bold' },
   { title: 'Tipo', data: 'tipo' },
   // {
   //    title: 'Origem',
   //    data: 'origem',
   //    render: (data) => `${data} `,
   //    className: 'text-left',
   // },
   // { title: 'Destino', data: 'destino' },
   {
      title: 'Qtd Viagens',
      data: null,
      render: function (data, type, row) {
         return row.viagens ? row.viagens.length : 0;
      },
      className: 'text-center',
   },
   {
      title: 'Ativa',
      data: 'ativo',
      class: 'dt-center small',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
];

const currentEventId = computed(() => currentEvent.value?.id ?? '');
// console.log('currentEventId:', currentEventId);

// define os valores padrão dos campos do formulário
const defaultValues = {
   evento_id: currentEventId,
   nome: '',
   tipo: 'Chegada',
   origem: 'Nome do Ponto de origem',
   destino: 'Nome do Ponto de destino',
   ativo: 'SIM',
};

// carrega listas de entidades da API para popular listas: <selects> os filtros
// Agora a Lista de Eventos Ativos sõa carregado única vez após o login e ficam na Store
import { useEventosStore } from '@/stores/useEventosStore';
const eventosStore = useEventosStore();

// ANTES carregava a lista de Eventos junto com a página
// fetchEventos();

// filtro da página - usar quando não há filtros
// const filters = [{}]; // nessse caso sem filtros

// Filtros da Página com valores fixos - filtro reativo aos dados carregados
const filters = computed(() => {
   const ativos = eventosStore.ativos || [];
   const defaultEventId = currentEvent.value?.id || '';

   return [
      // {
      //    label: 'Evento',
      //    field: 'evento_id',
      //    type: 'select',
      //    options: ativos.map((evento) => ({
      //       value: evento.id,
      //       label: evento.sigla,
      //    })),
      // },
      {
         label: 'Tipo de Rota',
         field: 'tipo',
         // default: 'Chegada',
         type: 'select',
         options: [
            { value: 'Chegada', label: 'Chegada' },
            { value: 'Partida', label: 'Partida' },
         ],
      },
      {
         label: 'Ativa',
         field: 'ativo',
         // default: 'SIM',
         type: 'select',
         options: [
            { value: 'SIM', label: 'SIM' },
            { value: 'NÃO', label: 'NÃO' },
         ],
      },
   ];
});

const rotaNomeInput = ref(null);
</script>

<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      title="Lista de Rotas de Viagens"
      description=" - Gerenciamento de Rotas de Viagens. <br>Usuários <b>Gerentes de Transportes</b> podem incluir, editar, excluir e desativar Rotas."
      endpoint="rota"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :abilities="abilities"
   >
      <template #form="{ form, errors }">
         <!-- {{ rotas }} -->
         <!-- {{ form.value }} -->
         <!-- ...(form.value.eventos || []).map((ev) => ({ -->
         <!-- <p>Evento Atual: {{ currentEventId }}</p> -->
         <!-- {{ currentEventId }} -->

         <label class="form-label fw-bold">Evento</label>
         <CFormSelect
            v-model="form.value.evento_id"
            :options="[
               ...(glbventosAtivos || [])
                  .filter((ev) => ev.id === currentEventId)
                  .map((ev) => ({
                     value: ev.id,
                     label: ev.nome,
                  })),
            ]"
         />
         <div class="form-error" v-if="errors.value.evento_id">
            {{ errors.value.evento_id[0] }}
         </div>

         <label class="form-label fw-bold">Nome da Rota</label>
         <CFormInput
            v-model="form.value.nome"
            ref="rotaNomeInput"
            :class="{ 'is-invalid': errors.nome }"
         />
         <div class="form-error" v-if="errors.value.nome">
            {{ errors.value.nome[0] }}
         </div>

         <label class="form-label fw-bold">Tipo</label>
         <CFormSelect
            v-model="form.value.tipo"
            :options="[
               { value: '', label: 'Selecione' },
               { value: 'Chegada', label: 'Chegada' },
               { value: 'Partida', label: 'Partida' },
            ]"
         />
         <div class="form-error" v-if="errors.value.tipo">
            {{ errors.value.tipo[0] }}
         </div>

         <label class="form-label fw-bold">Local de Origem</label>
         <CFormInput
            v-model="form.value.origem"
            :class="{ 'is-invalid': errors.origem }"
         />
         <div class="form-error" v-if="errors.value.origem">
            {{ errors.value.origem[0] }}
         </div>

         <label class="form-label fw-bold">Local de Destino</label>
         <CFormInput
            v-model="form.value.destino"
            :class="{ 'is-invalid': errors.destino }"
         />
         <div class="form-error" v-if="errors.value.destino">
            {{ errors.value.destino[0] }}
         </div>

         <label class="form-label fw-bold">Ativa</label>
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
