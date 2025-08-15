<template>
   <!-- {{ rotas }} -->
   <!-- modalFullscreen="fullscreen" -->

   <GenericCrud
      ref="crudRef"
      modalSize="small"
      visible
      title="Cadastro de Tipos de Quartos de Hotel "
      description="Gerenciamento os Tipos de Quartos de Hotel"
      endpoint="quartotipo"
      columnActionsWidth="160px"
      :pageButtons="pageButtons"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :abilities="abilities"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <!-- {{ rotas }} -->
         <!-- {{ form.value }} -->

         <CFormLabel class="form-label fw-bold">Nome</CFormLabel>
         <CFormInput
            v-model="form.value.nome"
            :class="{ 'is-invalid': errors.value.nome }"
         />
         <div class="form-error" v-if="errors.value.nome">
            {{ errors.value.nome[0] }}
         </div>

         <CFormLabel class="form-label fw-bold">Sigla</CFormLabel>
         <CFormInput
            v-model="form.value.sigla"
            :class="{ 'is-invalid': errors.value.sigla }"
         />
         <div class="form-error" v-if="errors.value.sigla">
            {{ errors.value.sigla[0] }}
         </div>

         <CFormLabel class="form-label fw-bold">Descrição</CFormLabel>
         <CFormTextarea
            v-model="form.value.descricao"
            :class="{ 'is-invalid': errors.value.descricao }"
            rows="4"
            placeholder="Descrição ..."
         />
         <div class="form-error" v-if="errors.value.descricao">
            {{ errors.value.descricao[0] }}
         </div>

         <CFormLabel class="form-label fw-bold">Ativo</CFormLabel>
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

<script setup>
import { ref, toRaw, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import api from '@/services/api';

// import 'datatables.net-dt';
import DataTablesLib from 'datatables.net-bs5';

// define a Entidade Principal da View
const entity = 'quartotipo';

const { showToast } = useToast(); // Toasts de Alerta

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

// DEBUG de todas abilities do User Logado
const crudRef = ref(null);

function chamarRefresh() {
   crudRef.value?.refreshTable();
}

/**
 * BASE Crud - colunas da tabela de dados
 */
const columns = [
   { title: 'ID', data: 'id', width: '30px' },
   { title: 'Nome', data: 'nome', width: '220px', class: 'fw-bold' },
   { title: 'Sigla', data: 'sigla', width: '80px' },
   { title: 'Descrição', data: 'descricao', width: 'auto' },
   {
      title: 'Ativa',
      data: 'ativo',
      // class: 'dt-center small',
      className: 'text-center',
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   // { title: 'Tema', data: 'tema', width: 'auto' },
];

/**
 * BASE Crud - Valores padrão dos campos do formulário
 */
const defaultValues = {
   nome: '',
   sigla: '',
   descricao: '',
   ativo: 'SIM',
};

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso - recupera as abilities do usuário logado na ação
   const canEditarRegiao = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';
   return '';
   //    return `
   //     <button class="btn btn-xs btn-outline-info" ${canEditarRegiao} data-custom-action="editarRegiao" data-param1="${row.regiao.id}" data-param2="${row.regiao.sigla}" >Editar Região</button>
   //   `;
};

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const pessoaShowModal = ref(false);
const pessoaFormDados = ref({});
const pessoaFormErros = ref({});

/**
 * ESPECIALIZAÇÃO CRUD: recupera da API listas de dados necessários para o CRUD
 * ex.: lista de Regiões do País
 */
import { useEventos } from '@/composables/useEventos';
const { fetchEntidades, entidades } = useEventos();

/**
 * BASE Crud - botões padrão - aqui você pode desativer botões básicos do CRUD.
 * Default: true para todos
 */
const buttons = { update: true, delete: true, show: false };

/**
 * BASE Crud - Filtros da tabela de dados
 * Necessário que a API receba o parametro enviado no GET e aplique o filtro where requerido
 */
//  const filters = [{}]; // nessse caso sem filtros

const pageButtons = computed(() => [
   {
      label: 'Print1',
      action: 'relatorio1',
      class: 'btn btn-sm btn-outline-info me-1',
   },
   {
      label: 'Print2',
      action: 'relatorio2',
      class: 'btn btn-sm btn-outline-warning me-1',
   },
]);

const filters = computed(() => [
   {
      label: 'Ativo',
      field: 'ativo',
      type: 'select',
      options: [
         { value: 'SIM', label: 'SIM' },
         { value: 'NÃO', label: 'NÃO' },
      ],
   },
]);

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   if (action === 'editarRegiao') {
      // console.log('ZAP: ', row, action, dataset, target);
      // vamos chamar uma função editar a action 'editarRegiao'
      // nesse caso estamos usando os dados da linha (row) para preencher o formulário
      // pessoaFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      // editarRegiao();
      // mas poderiamos também apenas passar o id da região para a função editarRegiao(id) e carregar os dados da API novamente com os dados atualizados
   }
};
</script>
