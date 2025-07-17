<script setup>
import { ref, toRaw, computed, reactive } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import api from '@/services/api';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import { formatToBrDateTime } from '@/utils/dateFormat';
import DataTablesLib from 'datatables.net-bs5';

import { useCurrentEventStore } from '@/stores/currentEvent'



// vamos pegar o Evento Selecionado
const eventStore = useCurrentEventStore()
const currentEvent = computed(() => eventStore.getEvent)
// console.log('Inscrição currentEvent:', currentEvent.value);


// define a Entidade Principal da View
const entity = 'inscricao';
// const entity = 'inscricao';

const { showToast } = useToast(); // Toasts de Alerta

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

// Permissões específicas para a entidade "veiculo"
// const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
// const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
// const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
// const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
// const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro
// var canPrint = can(`${entity}.print`);
// var canPrint = false;

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
   { title: 'ID', data: 'id' },
   { title: 'Evento', data: 'evento.sigla', width: '100px' },
   {
      title: 'Pessoa | Entidade | Papel | Modalidade',
      data: null, // importante usar null quando o render vai acessar múltiplos campos
      render: function (data, type, row) {
         const nome = row.pessoa?.nome_social || '';
         // const papel = row.funcao?.sigla || '';
         const papel = row.funcao?.descricao || '';
         const modalidade = row.modalidade || 'Não informada';
         const entidade_sigla = row.pessoa?.entidade?.sigla ?? 'Sem Entidade';
         return `<span class="fw-bold">${nome}</span> <small class="text-muted">${entidade_sigla}</small> <br/> <small class="text-muted">${papel} - ${modalidade}</small>`;
      },
      className: 'text-left',
      width: '320px',
   },
   { title: 'Entidade', data: 'pessoa.entidade.sigla', width: '100px' },
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
      width: '180px',
   },
   {
      title: 'Partida',
      data: null,
      render: function (data, type, row) {
         const meio = row.partida_meio_transp || 'Meio';
         const cia = row.partida_cia_transp || 'Cia';
         const dh = row.partida_data_hora
            ? formatToBrDateTime(`${row.partida_data_hora}`)
            : 'Data/Hora';
         return `<span class="">${meio} - ${cia}</span> <br/> <small class="text-muted">${dh}</small>`;
      },
      className: 'text-left',
      width: '180px',
   },
   // { title: 'Partida', data: 'partida_meio_transp', width: '140px' },
   {
      title: 'Serviços',
      data: null,
      width: '140px',
      render: function (data, type, row) {
         return '';
      },
   },
   {
      title: 'Ativa',
      data: 'ativo',
      class: 'dt-center small',
      width: '60px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
];

/**
 * BASE Crud - Valores padrão dos campos do formulário
 */
const defaultValues = {
   entidade_id: null,
   nome_completo: 'Meu Nome Completo',
   nome_social: 'Meu Nome',
   telefone: '(00) 90000-0000',
   email: 'nome@mail.com',
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
   //       <button class="btn btn-xs btn-outline-info" ${canEditarRegiao} data-custom-action="editarCarro" data-param1="${row.regiao.id}" data-param2="${row.regiao.sigla}" >Editar Carro</button>
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
      label: 'Evento',
      field: 'evento_id',
      type: 'select',
      selected: currentEvent.value?.id ?? null,    // define o selected com valor do Pinia
      options: eventos.value.map((evento) => ({
         value: evento.id,
         label: evento.sigla,
      })),
   },
   {
      label: 'Ativa',
      field: 'ativo',
      type: 'select',
      options: [
         { value: 'SIM', label: 'SIM' },
         { value: 'NÃO', label: 'NÃO' },
      ],
   },
   {
      label: 'Entidade',
      field: 'pessoa__entidade_id', // '__' duplo para enganar o PHP que converte o . para _ nas URL
      type: 'select',
      options: entidades.value.map((entidade) => ({
         value: entidade.id,
         label: entidade.sigla,
      })),
   },
   {
      label: 'Modalidade',
      field: 'modalidade',
      type: 'select',
      options: [
         { value: 'Presencial', label: 'Presencial' },
         { value: 'Virtual', label: 'Virtual' },
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

   if (action == 'editarCarro') {
      console.log('editarCarro: ', row, action, dataset, target);
      // criar as refs(), ex: pessoaFormDados.value (ver acima)
      // carregar os dados: usar o mesmos da row DataTables recebidos ou carregar via
      // chamar função editEntidade()
      // depois chamar a função para persistir os dados ex. salvarRegiao() ver abaixo como foi usado
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
      console.log('Try Salvar Região:', toRaw(pessoaFormDados.value.regiao));

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

   <GenericCrud
      ref="crudRef"
      modalSize="xxl"
      modalFullscreen="fullscreen"
      title="Cadastro de Inscrições "
      description="Gerenciamento do cadastro de Inscrições de Pessoas em Eventos"
      endpoint="inscricao"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :abilities="abilities"
      :canList="canList"
      :canShow="canShow"
      :canInsert="canInsert"
      :canUpdate="canUpdate"
      :canDelete="canDelete"
      :canPrint="canPrint"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->

         <CCard>
            <CCardHeader
               ><CCardTitle>Ficha de Inscrição</CCardTitle></CCardHeader
            >
            <CAlert color="info" style="margin: 16px"
               >Resize your browser to show the responsive offcanvas
               toggle.</CAlert
            >

            <CCardBody>
               <CAccordion :active-item-key="1" always-open>
                  <CAccordionItem :item-key="1">
                     <CAccordionHeader>
                        <strong>Identificação da Inscrição </strong> somente
                        poderá ser enviada com o preenchimento de todos os
                        campos e informações.</CAccordionHeader
                     >
                     <CAccordionBody>
                        <!-- Evento -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Nome do Evento</CFormLabel
                           >
                           <CCol sm="4">
                              <CFormSelect
                                 v-model="form.value.evento_id"
                                 :options="[
                                    { value: '', label: 'Selecione' },
                                    ...eventos.map((evento) => ({
                                       value: evento.id,
                                       label: evento.sigla,
                                    })),
                                 ]"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.pessoa_id"
                              >
                                 {{ errors.value.pessoa_id[0] }}
                              </div>
                           </CCol>
                        </CRow>

                        <!-- Pessoa -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Pessoa</CFormLabel
                           >
                           <CCol sm="4">
                              <CFormSelect
                                 v-model="form.value.pessoa_id"
                                 :options="[
                                    { value: '', label: 'Selecione' },
                                    ...pessoas.map((pessoa) => ({
                                       value: pessoa.id,
                                       label: pessoa.nome_completo,
                                    })),
                                 ]"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.pessoa_id"
                              >
                                 {{ errors.value.pessoa_id[0] }}
                              </div>
                           </CCol>
                        </CRow>

                        <!-- Função/Papel no Evento -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Papel no Evento</CFormLabel
                           >
                           <CCol sm="4">
                              <CFormSelect
                                 v-model="form.value.funcao_id"
                                 :options="[
                                    { value: '', label: 'Selecione' },
                                    ...funcoes.map((funcao) => ({
                                       value: funcao.id,
                                       label: funcao.sigla,
                                    })),
                                 ]"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.funcao_id"
                              >
                                 {{ errors.value.funcao_id[0] }}
                              </div>
                           </CCol>
                        </CRow>

                        <!-- Modalidade -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Modalidade</CFormLabel
                           >
                           <CCol sm="4">
                              <CFormSelect
                                 v-model="form.value.modalidade"
                                 :options="[
                                    { value: '', label: 'Selecione' },
                                    {
                                       value: 'Presencial',
                                       label: 'Presencial',
                                    },
                                    { value: 'Virtual', label: 'Virtual' },
                                 ]"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.modalidade"
                              >
                                 {{ errors.value.modalidade[0] }}
                              </div>
                           </CCol>
                        </CRow>

                        <!-- Credenciou? -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Credenciou?</CFormLabel
                           >
                           <CCol sm="4">
                              <CFormSelect
                                 v-model="form.value.credenciou"
                                 :options="[
                                    { value: '', label: 'Selecione' },
                                    { value: 'SIM', label: 'SIM' },
                                    { value: 'NÃO', label: 'NÃO' },
                                 ]"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.credenciou"
                              >
                                 {{ errors.value.credenciou[0] }}
                              </div>
                           </CCol>
                        </CRow>

                        <!-- Observações -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Observações</CFormLabel
                           >
                           <CCol sm="4">
                              <CFormTextarea
                                 v-model="form.value.observacao"
                                 :class="{ 'is-invalid': errors.observacao }"
                                 rows="2"
                                 placeholder="Observações pertinente..."
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.observacao"
                              >
                                 {{ errors.value.observacao[0] }}
                              </div>
                           </CCol>
                        </CRow>
                     </CAccordionBody>
                  </CAccordionItem>
               </CAccordion>

               <!-- Chegada Meio Transporte -->

               <!-- Dados da Chegada em uma linha -->
               <CAccordion
                  :active-item-key="1"
                  always-open
                  style="margin-top: 16px"
               >
                  <CAccordionItem :item-key="1">
                     <CAccordionHeader
                        ><strong
                           >Transporte Chegada e Partida de Brasília
                        </strong>
                        A FEB oferece traslado na chegada e retorno dos
                        participantes (aeroporto/rodoviária – FEB/Hotel), bem
                        como no percurso Hotel – FEB – Hotel durante os dias do
                        evento. O traslado é oferecido somente para o hotel
                        contratado para o evento.
                     </CAccordionHeader>
                     <CAccordionBody>
                        <CRow
                           class="form-group mx-auto"
                           style="
                              margin-top: 16px;
                              width: 80%;
                              justify-content: flex-center;
                           "
                        >
                           <!-- Campo 1 -->
                           <CCol sm="3">
                              <CFormLabel class="form-label fw-bold text-center"
                                 >Chegada Meio Transporte</CFormLabel
                              >
                              <CFormSelect
                                 v-model="form.value.chegada_meio_transp"
                                 :options="[
                                    { value: '', label: 'Selecione' },
                                    { value: 'Aéreo', label: 'Aéreo' },
                                    {
                                       value: 'Rodoviário',
                                       label: 'Rodoviário',
                                    },
                                    {
                                       value: 'Rodo Particular',
                                       label: 'Rodo Particular',
                                    },
                                    {
                                       value: 'Não Informado',
                                       label: 'Não Informado',
                                    },
                                 ]"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.chegada_meio_transp"
                              >
                                 {{ errors.value.chegada_meio_transp[0] }}
                              </div>
                           </CCol>

                           <!-- Cia -->
                           <CCol sm="3">
                              <CFormLabel class="form-label fw-bold text-center"
                                 >Chegada Companhia + Nº</CFormLabel
                              >
                              <CFormInput
                                 v-model="form.value.chegada_cia_transp"
                                 :class="{
                                    'is-invalid': errors.chegada_cia_transp,
                                 }"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.chegada_cia_transp"
                              >
                                 {{ errors.value.chegada_cia_transp[0] }}
                              </div>
                           </CCol>

                           <!-- Chegada Data/Hora -->
                           <CCol sm="3">
                              <CFormLabel class="form-label fw-bold text-center"
                                 >Chegada Data/Hora</CFormLabel
                              >
                              <CFormInput
                                 v-model="form.value.chegada_data_hora"
                                 type="datetime-local"
                                 :class="{
                                    'is-invalid': errors.chegada_data_hora,
                                 }"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.chegada_data_hora"
                              >
                                 {{ errors.value.chegada_data_hora[0] }}
                              </div>
                           </CCol>
                        </CRow>
                     </CAccordionBody>
                  </CAccordionItem>
               </CAccordion>

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

   <!-- Extra Modal Especializado -->
   <CModal
      :visible="pessoaShowModal"
      @close="pessoaShowModal = false"
      backdrop="static"
   >
      <CModalHeader>
         <strong>Editar Região</strong>
      </CModalHeader>
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Nome da Região</label>
         <!-- <div class="form-text">
            {{ pessoaFormDados.regiao.descricao }}
         </div> -->

         <CFormInput
            v-model="pessoaFormDados.regiao.descricao"
            :class="{ 'is-invalid': pessoaFormErros.descricao }"
         />

         <label class="form-label fw-bold mb-1 mt-0">Sigla</label>
         <CFormInput
            v-model="pessoaFormDados.regiao.sigla"
            :class="{ 'is-invalid': pessoaFormErros.sigla }"
         />
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="pessoaShowModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <CButton color="btn btn-primary btn-sm me-1" @click="salvarRegiao"
            >Salvar</CButton
         >
      </CModalFooter>
   </CModal>
</template>
