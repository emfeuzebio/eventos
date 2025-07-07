<script setup>
import { ref, toRaw, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import DateInputWrapper from '@/components/DateInputWrapper.vue';
import DateTimeInputWrapper from '@/components/DateTimeInputWrapper.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import { formatToBrDateTime } from '@/utils/dateFormat';
import { formatToBrDate } from '@/utils/dateFormat';
import 'datatables.net-dt';
import api from '@/services/api';

// define a Entidade Principal da View
// define a Entidade Principal da View
const entity = 'evento';

const { showToast } = useToast(); // Toasts de Alerta

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

// Permissões específicas para a entidade "veiculo"
const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro
var canPrint = can(`${entity}.print`);
var canPrint = false;

// DEBUG de todas abilities do User Logado
// console.log(`Abilities carregadas da entidade '${entity}'':`, abilities);
// console.log('canList:', canList); // Isso deve ser true ou false
// console.log('canShow:', canShow); // Isso deve ser true ou false
// console.log('canInsert:', canInsert); // Isso deve ser true ou false
// console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
// console.log('canDelete:', canDelete); // Isso deve ser true ou false
// console.log('canPrint:', canPrint); // Isso deve ser true ou false

const crudRef = ref(null);

function chamarRefresh() {
   crudRef.value?.refreshTable();
}

/**
 * BASE Crud - colunas da tabela de dados
 */
const columns = [
   { title: 'ID', data: 'id', width: '10px' },
   // { title: 'Organização', data: 'organizacao_id', width: '100px' },
   {
      title: 'Sigla',
      data: 'sigla',
      width: '140px',
      class: 'fw-bold',
   },
   { title: 'Nome do Evento', data: 'nome', width: '260px' },
   { title: 'Periodo', data: 'periodo', width: 'auto' },
   {
      title: 'Dt Início',
      data: null,
      render: function (data, type, row) {
         const dt_inicio = row.inscricao_data_ini?.trim()
            ? formatToBrDate(row.inscricao_data_ini)
            : 'Não informado';
         return `<span class="">${dt_inicio}</span>`;
      },
      className: 'text-center',
      width: '100px',
   },
   {
      title: 'Dt Fim',
      data: null,
      render: function (data, type, row) {
         const dt_fim = row.inscricao_data_fim?.trim()
            ? formatToBrDate(row.inscricao_data_fim)
            : 'Não informado';
         return `<span class="">${dt_fim}</span>`;
      },
      className: 'text-center',
      width: '100px',
   },
   {
      title: 'Ativo',
      data: 'ativo',
      class: 'dt-center small',
      width: '60px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   // { title: 'Tema', data: 'tema', width: 'auto' },

   // { title: 'Início', data: 'inscricao_data_ini', width: '90px', className: 'text-center', },
   // { title: 'Fim', data: 'inscricao_data_fim', width: '90px', className: 'text-center', },
   // {
   //    title: 'Pessoa | Entidade | Papel | Modalidade',
   //    data: null, // importante usar null quando o render vai acessar múltiplos campos
   //    render: function (data, type, row) {
   //       const nome = row.pessoa?.nome_social || '';
   //       const modalidade = row.modalidade || 'Não informada';
   //       const entidade_sigla = row.pessoa?.entidade?.sigla ?? 'Sem Entidade';
   //       return `<span class="fw-bold">${nome}</span> <small class="text-muted">${entidade_sigla}</small> <br/> <small class="text-muted">${papel} - ${modalidade}</small>`;
   //    },
   //    className: 'text-left',
   //    width: '320px',
];

/**
 * BASE Crud - Valores padrão dos campos do formulário
 */
const defaultValues = {
   organizacao_id: 1,
   nome: 'Nome do Evento',
   sigla: 'Sigla do Evento',
   descricao: 'Descrição completa do Evento',
   local: 'FEB',
   periodo: 'De 10 a 12 de Outubro de 20xx',
   tema: 'Você e a paz',
   inscricao_data_ini: '',
   inscricao_data_fim: '',
   ativo: 'SIM',
   // valor_cafe: '0.00',
   // valor_lanche: '0.00',
   // valor_almoco: '0.00',
   // valor_jantar: '0.00',
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
 *       lista de Cidades
 *       lista de Categorias
 *       lista de Tipos de Eventos
 */
import { useEventos } from '@/composables/useEventos';
const {
   fetchEntidades,
   entidades,
   fetchFuncoes,
   funcoes,
   fetchPessoas,
   pessoas,
   fetchEventos,
   eventos,
} = useEventos();
fetchEventos();
fetchEntidades();
fetchFuncoes();
fetchPessoas();
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

// const filters = computed(() => [
//    {
//       label: 'Ativo',
//       field: 'ativo',
//       type: 'select',
//       options: regioes.value.map((regiao) => ({
//          value: regiao.id,
//          label: regiao.descricao,
//       })),
//    },
// ]);

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   console.log(
      'onExtraAction ID:',
      id,
      'row:',
      row,
      'action:',
      action,
      'dataset:',
      dataset,
      'target: (por ora não usado)',
      target
   );

   if (action === 'editarRegiao') {
      // console.log('ZAP: ', row, action, dataset, target);
      // vamos chamar uma função editar a action 'editarRegiao'
      // nesse caso estamos usando os dados da linha (row) para preencher o formulário
      pessoaFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      editarRegiao();
      // mas poderiamos também apenas passar o id da região para a função editarRegiao(id) e carregar os dados da API novamente com os dados atualizados
   }
};

const editarRegiao = async () => {
   // Aqui você pode implementar a lógica para editar a região
   // ou já usamos os dados do formulário preenchidos
   // console.log('Editar Região:', pessoaFormDados.value);
   pessoaShowModal.value = true;
   // ou aqui poderia chamar uma API para buscar os dados da região pelo ID
   // pessoaShowModal.value = false; // Fecha o modal após salvar
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarRegiao = async () => {
   // console.log('Salvar Região:', pessoaFormDados.value.regiao);

   try {
      // console.log('Try Salvar Região:', pessoaFormDados.value.regiao);
      // console.log('Try Salvar Região:', toRaw(pessoaFormDados.value.regiao));

      await api.put(
         `regiao/${pessoaFormDados.value.regiao.id}`,
         toRaw(pessoaFormDados.value.regiao)
      );

      showToast({
         title: 'Sucesso',
         message: `Região ID ${pessoaFormDados.value.regiao.id} atualizada com sucesso.`,
      });
      pessoaShowModal.value = false;
      chamarRefresh(); // chama refreshTable() do composable via expose
   } catch (error) {
      if (error.response?.status === 422) {
         pessoaFormErros.value = error.response.data.errors || {};
      }
   }
};
</script>

<template>
   <!-- {{ rotas }} -->
   <!-- modalFullscreen="fullscreen" -->

   <GenericCrud
      ref="crudRef"
      modalSize="lg"
      title="Cadastro de Eventos "
      description="Gerenciamento do cadastro de Eventos"
      endpoint="evento"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :abilities="abilities"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->

         <CCard>
            <!-- <CCardHeader
               ><CCardTitle>Editar Evento</CCardTitle></CCardHeader
            > -->
            <CCardBody>
               <!-- Nome do Evento -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Nome</CFormLabel
                  >
                  <CCol sm="8">
                     <CFormInput
                        v-model="form.value.nome"
                        :class="{ 'is-invalid': errors.nome }"
                     />
                     <div class="form-error" v-if="errors.value.nome">
                        {{ errors.value.nome[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Sigla do Evento -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Sigla</CFormLabel
                  >
                  <CCol sm="8">
                     <CFormInput
                        v-model="form.value.sigla"
                        :class="{ 'is-invalid': errors.sigla }"
                     />
                     <div class="form-error" v-if="errors.value.sigla">
                        {{ errors.value.sigla[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Descrição -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Observações</CFormLabel
                  >
                  <CCol sm="8">
                     <CFormTextarea
                        v-model="form.value.descricao"
                        :class="{ 'is-invalid': errors.descricao }"
                        rows="6"
                        placeholder="Descrição ..."
                     />
                     <div class="form-error" v-if="errors.value.descricao">
                        {{ errors.value.descricao[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Local do Evento -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Local</CFormLabel
                  >
                  <CCol sm="8">
                     <CFormTextarea
                        v-model="form.value.local"
                        :class="{ 'is-invalid': errors.local }"
                        rows="2"
                        placeholder="Local..."
                     />
                     <div class="form-error" v-if="errors.value.local">
                        {{ errors.value.local[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Período do Evento -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Período</CFormLabel
                  >
                  <CCol sm="8">
                     <CFormInput
                        v-model="form.value.periodo"
                        :class="{ 'is-invalid': errors.periodo }"
                     />
                     <div class="form-error" v-if="errors.value.periodo">
                        {{ errors.value.periodo[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Tema do Evento -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Tema</CFormLabel
                  >
                  <CCol sm="8">
                     <CFormInput
                        v-model="form.value.tema"
                        :class="{ 'is-invalid': errors.tema }"
                     />
                     <div class="form-error" v-if="errors.value.tema">
                        {{ errors.value.tema[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Data Início do Evento -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Data Início</CFormLabel
                  >
                  <CCol sm="4">
                     <CFormInput
                        v-model="form.value.inscricao_data_ini"
                        type="date"
                        :class="{
                           'is-invalid': errors.inscricao_data_ini,
                        }"
                     />
                     <div
                        class="form-error"
                        v-if="errors.value.inscricao_data_ini"
                     >
                        {{ errors.value.inscricao_data_ini[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Data Término do Evento -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Data Fim</CFormLabel
                  >
                  <CCol sm="4">
                     <CFormInput
                        v-model="form.value.inscricao_data_fim"
                        type="date"
                        :class="{
                           'is-invalid': errors.inscricao_data_fim,
                        }"
                     />
                     <div
                        class="form-error"
                        v-if="errors.value.inscricao_data_fim"
                     >
                        {{ errors.value.inscricao_data_fim[0] }}
                     </div>
                  </CCol>
               </CRow>

               <!-- Ativo -->
               <CRow class="form-group" style="margin-top: 16px">
                  <CFormLabel class="col-sm-3 form-label fw-bold text-end"
                     >Ativo?</CFormLabel
                  >
                  <CCol sm="4">
                     <CFormSelect
                        v-model="form.value.ativo"
                        :options="[
                           { value: '', label: 'Selecione' },
                           { value: 'SIM', label: 'SIM' },
                           { value: 'NÃO', label: 'NÃO' },
                        ]"
                     />
                     <div class="form-error" v-if="errors.value.ativo">
                        {{ errors.value.ativo[0] }}
                     </div>
                  </CCol>
               </CRow>
            </CCardBody>
         </CCard>
      </template>
   </GenericCrud>
</template>
