<script setup>
import { computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';
import { formatToBrDateTime } from '@/utils/dateFormat';

import { useEventos } from '@/composables/useEventos';
const { fetchRegioes, regioes } = useEventos();

// define a Entidade Principal da View
const entity = 'inscricao';

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
   // { title: 'Evento', data: 'evento_id' },
   {
      title: 'Evento',
      data: 'evento.sigla',
      render: (data) => `${data} `,
      className: 'text-left',
   },
   {
      title: 'Pessoa / Papel / Modalidade',
      data: null, // importante usar null quando o render vai acessar múltiplos campos
      render: function (data, type, row) {
         const nome = row.pessoa?.nome_social || '';
         // const papel = row.funcao?.sigla || '';
         const papel = row.funcao?.descricao || '';
         const modalidade = row.modalidade || 'Não informada';
         return `<span class="fw-bold">${nome}</span> <br/> <small class="text-muted">${papel} - ${modalidade}</small>`;
      },
      className: 'text-left',
   },
   { title: 'Entidade', data: 'pessoa.entidade.sigla' },
   // {
   //    title: 'Entidade',
   //    data: 'entidade.sigla',
   //    render: (data) => `${data} `,
   //    className: 'text-left',
   // },
   // { title: 'Chegada', data: 'chegada_meio_transp' },
   {
      title: 'Chegada',
      data: null,
      render: function (data, type, row) {
         const meio = row.chegada_meio_transp || 'Meio';
         const cia = row.chegada_cia_transp || 'Cia';
         const dh = row.chegada_data_hora
            ? formatToBrDateTime(`${row.chegada_data_hora}`)
            : 'Data/Hora';
         return `<span class="">${meio} - ${cia}</span> <br/> <small class="text-muted">${dh}</small>`;
      },
      className: 'text-left',
   },
   { title: 'Partida', data: 'partida_meio_transp' },

   {
      title: 'Serviços',
      // data: 'regiao.descricao',
      data: null,
      render: (data) => `?`,
      className: 'text-center',
   },
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
   // { title: 'Pessoa / Papel / Mod', data: 'pessoa_id', class: 'fw-bold' },
   // {
   //    title: 'Pessoa / Pepel',
   //    data: 'pessoa.nome_social',
   //    render: (data) => `${data} `,
   //    className: 'text-left',
   //    class: 'fw-bold',
   // },
   // {
   //    title: 'Papel',
   //    data: 'funcao.sigla',
   //    render: (data) => `${data} `,
   //    className: 'text-left',
   // },
];

// define os valores padrão dos campos do formulário
const defaultValues = {
   regiao_id: null,
   sigla: 'Sigla',
   descricao: 'Descrição',
};

// carrega listas de estidades da API para popular listas: <selects> os filtros
fetchRegioes();

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
      endpoint="inscricao"
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

         <label class="form-label fw-bold">Região do País</label>
         <CFormSelect
            v-model="form.value.regiao_id"
            :options="[
               { value: '', label: 'Selecione' },
               ...regioes.map((regiao) => ({
                  value: regiao.id,
                  label: regiao.descricao,
               })),
            ]"
         />
         <div class="form-error" v-if="errors.value.regiao_id">
            {{ errors.value.regiao_id[0] }}
         </div>
      </template>
   </GenericCrud>
</template>
