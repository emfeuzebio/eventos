<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      ref="crudRef"
      modalSize="xxl"
      modalFullscreen="fullscreen"
      title="Gestão de Chegadas "
      description="<br/>Gestão dos Traslados de Chegadas das Pessoas inscritas em Evento <br/> Ordenado pela Data-Hora de Chegada"
      endpoint="inscricao"
      columnActionsWidth="160px"
      :pageButtons="{ btnInsertNew: false, btnRefreshTable: true }"
      :pageExtraButtons="pageExtraButtons"
      :filters="filters"
      :columns="columns"
      :order="order"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :abilities="abilities"
      @extraAction="onExtraAction"
      @pageExtraButtonsActions="onpageExtraButtonsActions"
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
                           <CCol sm="4"
                              ><CFormLabel class="form-label fw-bold"
                                 >Nome do Evento</CFormLabel
                              ></CCol
                           >
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
               <!--          
         <hr />

         <CRow class="form-group" style="margin-top: 16px">
            <CFormLabel class="col-sm-3 form-label fw-bold text-end"
               >Chegada Meio Transporte</CFormLabel
            >
            <CCol sm="4">
               <CFormSelect
                  v-model="form.value.credenciou"
                  :options="[
                     { value: '', label: 'Selecione' },
                     { value: 'Aéreo', label: 'Aéreo' },
                     { value: 'Rodoviário', label: 'Rodoviário' },
                     { value: 'Rodo Particular', label: 'Rodo Particular' },
                     { value: 'Não Informado', label: 'Não Informado' },
                  ]"
               />
               <div class="form-error" v-if="errors.value.credenciou">
                  {{ errors.value.credenciou[0] }}
               </div>
            </CCol>
         </CRow>

         <CRow class="form-group" style="margin-top: 16px">
            <CFormLabel class="col-sm-3 form-label fw-bold text-end"
               >Chegada Companhia + Nº</CFormLabel
            >
            <CCol sm="4">
               <CFormInput
                  v-model="form.value.chegada_cia_transp"
                  :class="{ 'is-invalid': errors.chegada_cia_transp }"
               />
               <div class="form-error" v-if="errors.value.chegada_cia_transp">
                  {{ errors.value.chegada_cia_transp[0] }}
               </div>
            </CCol>
         </CRow>

         <CRow class="form-group" style="margin-top: 16px">
            <CFormLabel class="col-sm-3 form-label fw-bold text-end"
               >Chegada Data/Hora</CFormLabel
            >
            <CCol sm="4">
               <CFormInput
                  v-model="form.value.chegada_data_hora"
                  type="datetime-local"
                  :class="{ 'is-invalid': errors.chegada_data_hora }"
               />
               <div class="form-error" v-if="errors.value.chegada_data_hora">
                  {{ errors.value.chegada_data_hora[0] }}
               </div>
            </CCol>
         </CRow> -->

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
            </CCardBody>
         </CCard>
      </template>
   </GenericCrud>

   <!-- Editar Viagem Chegada Modal | Extra Modal Especializado -->
   <CModal
      :visible="viagemChegadaShowModal"
      @close="viagemChegadaShowModal = false"
   >
      <CModalHeader>
         <strong>Editar Viagem de Chegada</strong>
      </CModalHeader>
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Dados da Inscrição</label>
         <CAlert color="primary" v-html="inscricaoDados"></CAlert>

         <label class="form-label fw-bold">Selecione a Rota</label>
         <CFormSelect
            v-model="rotaSelecionada"
            :options="[
               { value: '', label: 'Selecione' },
               ...rotas.map((rota) => ({
                  value: rota.id,
                  label: rota.nome,
               })),
            ]"
            @change="fetchViagensPorRota($event.target.value)"
         />

         <label class="form-label fw-bold">Selecione a Viagem</label>
         <CFormSelect
            v-model="viagemSelecionada"
            :options="[
               { value: '', label: 'Selecione' },
               { value: 'remove', label: 'Remover a Viagem Atual' },
               ...viagensDaRota.map((viagem) => ({
                  value: viagem.id,
                  label:
                     'Id: ' +
                     viagem.id +
                     ' - ' +
                     formatToBrDateTime(`${viagem.data_hora}`) +
                     ' - ' +
                     viagem.veiculo.descricao,
               })),
            ]"
         />

         <label class="form-label fw-bold mb-1 mt-2"
            >Dados da Viagem de Traslado de Chegada marcada</label
         >
         <!-- <CAlert color="dark" v-html="viagemChegadaInscricao"></CAlert> -->
         <CAlert color="dark" v-html="viagemChegadaEscolhida"></CAlert>
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="viagemChegadaShowModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <CButton
            color="btn btn-primary btn-sm me-1"
            @click="salvarViagemChegada(viagemSelecionada)"
            >Salvar</CButton
         >
      </CModalFooter>
   </CModal>

   <!-- notificarMotoristaModal - Extra Modal Especializado -->
   <CModal
      :visible="notificarMotoristaModal"
      @close="notificarMotoristaModal = false"
   >
      <CModalHeader class="bg-primary fw-bold text-white"
         >Notificar Motorista</CModalHeader
      >
      <CModalBody>
         <CAlert color="info">
            <strong>Notificar Motorista</strong><br />
            Abaixo estão as informações das viagens escaladas para o Morotista
            'Nome'<br /><br />
            Voçe pode <strong>copiar</strong> a mensagem pronta abaixo para
            enviar por <strong>WhatsApp</strong> ou clicar no botão
            <strong>Notificar</strong> para enviar por <strong>e-mail</strong>.
         </CAlert>
         <!-- <label class="form-label fw-bold mb-1 mt-0">Nome da Região</label> -->

         <!-- <CFormInput
            v-model="regiaoFormDados.regiao.descricao"
            :class="{ 'is-invalid': regiaoFormErros.descricao }"
         /> -->

         <!-- <label class="form-label fw-bold mb-1 mt-0">Sigla</label>
         <CFormInput
            v-model="regiaoFormDados.regiao.sigla"
            :class="{ 'is-invalid': regiaoFormErros.sigla }"
         /> -->
      </CModalBody>
      <CModalFooter>
         <CButton color="btn btn-secondary btn-sm me-1" @click="cancelarEnvio()"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <CButton color="btn btn-primary btn-sm me-1" @click="confirmarEnvio()"
            ><i class="fa fa-plane"></i> Enviar E-Mail</CButton
         >
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { ref, toRaw, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useGlobalError } from '@/composables/useGlobalError';
import { useToast } from '@/composables/useToast';
import { formatToBrDateTime } from '@/utils/dateFormat';
import api from '@/services/api';

import DataTablesLib from 'datatables.net-bs5';

// Vamos obter a lista de Eventos Ativo e o Corrente do store store
import { useCurrentEventStore } from '@/stores/currentEvent';
const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);
const globalEventoId = computed(() => currentEventStore.currentEvent?.id || '');
// const currentEventId = currentEvent.value?.id ?? '';
// console.log('currentEventId:', currentEventId);

// define a Entidade Principal da View
const entity = 'inscricao';
// const entity = 'inscricao';

const { showToast } = useToast(); // Toasts de Alerta
const { showError } = useGlobalError(); // Modal de Erros

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
const crudRef = ref(null);
const confirmarEnvio = ref(null);
const cancelarEnvio = ref(null);

function chamarRefresh() {
   crudRef.value?.refreshTable();
}

/**
 * BASE Crud - colunas da tabela de dados
 */
const columns = [
   { title: 'ID', data: 'id', width: '50px' },
   {
      // esta coluna existe apenas para ordenação correta pela Data Hora chegada
      // abaixo adicionamos o 'T' entre a Data e a Hora para ficar no formato ISO-8601
      // e a ordenção ficar perfeita, senão o DataTables consideraria como uma String
      visible: false,
      title: 'DH Chegada',
      data: 'chegada_data_hora',
      render: (data, type) => {
         if (type === 'sort' && data) {
            // converte '2025-08-19 14:30:00' para '2025-08-19T14:30:00'
            return data.replace(' ', 'T');
         }
         return data || '';
      },
   },
   {
      title: 'Pessoa e Dados da Chegada',
      className: 'text-left',
      width: 'auto',
      data: null, // importante usar null quando o render vai acessar múltiplos campos
      render: function (data, type, row) {
         const nome = row.pessoa?.nome_social || '';
         const papel = row.funcao?.descricao || '';
         const modalidade = row.modalidade || 'Não informada';
         const entidade_sigla = row.pessoa?.entidade?.sigla ?? 'Sem Entidade';

         const chegada_meio_transp =
            row.chegada_meio_transp || 'Meio Não definido';
         const chegada_cia_transp = row.chegada_cia_transp || '';
         const chegada_data_hora = formatToBrDateTime(
            row.chegada_data_hora || 'Data-Hora Não definida'
         );
         const chegada_veiculo =
            row.viagem_chegada?.veiculo.descricao ||
            (row.chegada_traslado == 'SIM' ? 'Veículo Não definido' : '');

         return `<span class="fw-bold">${nome}</span> <small class="text-muted">${papel} > ${entidade_sigla} </small> <br/>
                     <span class="fw-bold">Modalidade</span>
                     <small class="text-muted">${modalidade}</small> <br/>
                     <span class="fw-bold">Chegada</span>
                     <small class="text-muted">${chegada_data_hora}</small> >
                     <small class="text-muted">${chegada_meio_transp}</small>
                     <small class="text-muted">${chegada_cia_transp}</small> <br/>
                     <span class="fw-bold">Traslado</span> ${row.chegada_traslado}
                     <small class="text-muted">${chegada_veiculo}</small> <br/>
                     <span class="fw-bold">Hospedagem</span> <small class="text-muted">${row.custeio_hospedagem}</small>
               `;

         // const nome = row.pessoa?.nome_social || '';
         // const papel = row.funcao?.descricao || '';
         // const modalidade = row.modalidade || 'Não informada';
         // const entidade_sigla = row.pessoa?.entidade?.sigla ?? 'Sem Entidade';
         // return `<span class="fw-bold">${nome}</span> <small class="text-muted">${entidade_sigla}</small> <br/> <small class="text-muted">${papel} - ${modalidade}</small>`;
      },
   },
   // { title: 'Entidade', data: 'pessoa.entidade.sigla', width: '100px' },
   // { title: 'Partida', data: 'partida_meio_transp', width: '140px' },
   {
      title: 'Traslado de Chegada',
      data: null,
      width: 'auto',
      className: 'text-center',
      render: function (data, type, row) {
         // TODO - API row não está trazndo a Viagem filha da Inscrição para obter os dados para por na Coluna Translado Chegada
         let text = '';
         if (row.viagem_chegada) {
            text += `${
               row.viagem_chegada?.rota.nome || 'Rota Não definida'
            } <br/>`;
            text += `${formatToBrDateTime(
               row.viagem_chegada?.data_hora || 'Data/Hora Não definida'
            )} <br/>`;
            // text += `<b>Tipo</b>: ${
            //    row.viagem_chegada?.rota.tipo || 'Tipo Rota Não definido'
            // } <br/>`;
            // text += `<b>Veículo</b>: ${
            // text += `Veículo: <b>${
            text += `<b>${
               row.viagem_chegada?.veiculo.descricao || 'Veículo Não definido'
            } </b><br/>`;
            // text += `<b>Tipo</b>: ${
            //    row.viagem_chegada?.veiculo.tipo || 'Tipo Veículo Não definido'
            // } <br/>`;
            // text += `<b>Motorista</b>: ${
            //    row.viagem_chegada?.veiculo.motorista || 'Motorista Não definido'
            // } <br/>`;
            // text += `<b>Fone</b>: ${
            //    row.viagem_chegada?.veiculo.telefone || 'Telefone não informado'
            // } <br/>`;
         }

         return text;
      },
   },

   // {
   //    title: 'Hospedagem',
   //    data: null,
   //    width: '160px',
   //    render: function (data, type, row) {
   //       return '';
   //    },
   // },

   // {
   //    title: 'Ativa',
   //    data: 'ativo',
   //    class: 'dt-center small',
   //    width: '60px',
   //    render: function (data, type, row) {
   //       return `<span class="${
   //          row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
   //       }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
   //    },
   // },
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
 * BASE Crud - Page Buttons são o Botões Extras no canto superior direito
 */
// const pageExtraButtons = [{}]; // sem extra buttons
const pageExtraButtons = computed(() => [
   {
      label: '<i class="fa fa-print"></i> Traslados Aero PDF',
      action: 'printRelTrasladosAero',
      class: 'btn btn-sm btn-outline-info me-1',
   },
]);

/**
 * CAPTURA as ações click dos pega Buttons e chama as funções necessárias
 */
const onpageExtraButtonsActions = async ({ label, action }) => {
   // console.log('onpageExtraButtonsActions: ', label, action);

   // Vamos chamar a função necessária para este evento
   if (action === 'printRelTrasladosAero') {
      printRelTrasladosAero();
   }
};

async function printRelTrasladosAero() {
   // try {
   const response = await api.get(
      `/inscricao/reltraslados/${globalEventoId.value}`,
      {
         params: { orderby: 'chegada' },
         responseType: 'blob',
      }
      // orderby: 'chegada',
   );

   const blob = new Blob([response.data], { type: 'application/pdf' });
   const url = window.URL.createObjectURL(blob);
   window.open(url, '_blank');
   window.URL.revokeObjectURL(url); // Liberar URL da memória

   showToast({
      title: 'Sucesso',
      message: `Relatório gerado com sucesso.`,
   });
   // } catch (error) {
   //    showError('Erro ao gerar o relatório: ' + error.response?.data.message);
   // }
}

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso - recupera as abilities do usuário logado na ação
   const canMarcarcheg = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';

   // trasposição do checkbox para os dados da linha
   const isChecked = row.traslado_chegada_executou === 'SIM' ? 'checked' : '';

   // return '';

   return `
      <div class="text-center">
         <button class="btn btn-xs btn-outline-info" ${canMarcarcheg} data-custom-action="marcarViagem" data-viagem-id="${row.traslado_chegada_viagem_id}" data-inscricao-id="${row.id}"><i class="fa fa-edit"></i> Marcar Viagem</button>

         <button class="btn btn-xs btn-outline-success" ${canMarcarcheg} data-custom-action="notificarPessoa" data-viagem-id="${row.traslado_chegada_viagem_id}" data-inscricao-id="${row.id}"><i class="fa fa-plane"></i> Notificar Pessoa</button>

         <button class="btn btn-xs btn-outline-success" ${canMarcarcheg} data-custom-action="notificarMotorista" data-viagem-id="${row.traslado_chegada_viagem_id}" data-inscricao-id="${row.id}"><i class="fa fa-plane"></i> Notificar Motorista</button>
         
         <div class="form-check form-switch d-inline-block">
            <label style="font-size: 12px; font-weight: bold;">Trasladou?</label>
            <input class="form-check-input" ${canMarcarcheg} data-custom-action="trasladou" type="checkbox" data-viagem-id="${row.traslado_chegada_viagem_id}"data-inscricao-id="${row.id}" ${isChecked} >
         </div>
      </div>
   `;
};

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const viagemChegadaShowModal = ref(false);
const viagemChegadaFormDados = ref({});
const viagemChegadaFormErros = ref({});
const viagemChegadaEscolhida = ref('');
const viagemChegadaInscricao = ref('');
const inscricaoDados = ref('');

const rotaSelecionada = ref(''); // ID da rota selecionada
const viagemSelecionada = ref(''); // ID da viagem selecionada
const viagensDaRota = ref([]); // array das viagens da Rota

const notificarMotoristaModal = ref(false);
const regiaoFormDados = ref({});
const regiaoFormErros = ref({});

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
   marcarTrasladoChegada,
   fetchRotas,
   fetchViagensDaRota,
   rotas,
} = useEventos();
fetchEventos();
fetchEntidades();
// fetchFuncoes();
// fetchPessoas();

/**
 * BASE Crud - botões padrão - aqui você pode desativer botões básicos do CRUD.
 * Default: true para todos
 */
// const buttons = { update: true, delete: true, show: false };
const buttons = { update: false, delete: false, show: false };

/**
 * BASE Crud - Filtros da tabela de dados
 * Necessário que a API receba o parametro enviado no GET e aplique o filtro where requerido
 */
const order = [1, 'asc']; // chegada_data_hora: nessse caso ordena pela segunda coluna [0,1,3,...] mesmo que ela esteja visible = false

//  const filters = [{}]; // nessse caso sem filtros
const filters = computed(() => [
   {
      label: 'Traslado',
      field: 'chegada_traslado',
      type: 'select',
      default: 'SIM',
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
   {
      label: 'Meio',
      field: 'chegada_meio_transp',
      type: 'select',
      // default: 'Aéreo',
      options: [
         { value: 'aereo', label: 'Aéreo' },
         { value: 'rodov', label: 'Rodoviário' },
         { value: 'rodop', label: 'Rodo Particular' },
         { value: 'ninfo', label: 'Não Informado' },
      ],
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
]);

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   // console.log(
   //    // 'onExtraAction ID:',
   //    // id,
   //    // 'row:',
   //    // row,
   //    'action:',
   //    action,
   //    'dataset:',
   //    dataset,
   //    'target:',
   //    target
   // );

   if (action == 'trasladou') {
      const inscricaoId = row.id;
      const viagemId = dataset.viagemId;
      const isChecked = target[0].checked ? 'SIM' : 'NÃO';
      // const isChecked = (e.currentTarget as HTMLInputElement).checked ? 'SIM' : 'NÃO';
      // console.log('trasladou viagem', inscricaoId, isChecked);
      // const isChecked = 'SIM';

      if (!viagemId) {
         showToast({
            title: 'Sucesso',
            message: `Impossível Marcar o Traslado de Chegada! Não existe uma Viagem marcada.`,
            color: 'danger',
         });
         return;
      }

      const sucesso = await marcarTrasladoChegada(inscricaoId, {
         traslado_chegada_executou: isChecked,
      });

      if (sucesso) {
         showToast({
            title: 'Sucesso',
            message: `Marcado Traslado Chegada ${isChecked} na Inscrição ${inscricaoId} com sucesso!`,
         });
      }
      chamarRefresh(); // chama refreshTable() do composable via expose
      // console.log('trasladou viagem', inscricaoId, isChecked);
      // mas poderiamos também apenas passar o id da região para a função editarRegiao(id) e carregar os dados da API novamente com os dados atualizados
   }

   if (action == 'notificarMotorista') {
      const inscricaoId = row.id;
      const viagemId = dataset.viagemId;

      if (!viagemId) {
         // alert('Impossível Notificar o Motorista! Não existe uma Viagem marcada.');
         showToast({
            title: 'Sucesso',
            message: `Impossível Notificar o Motorista! Não existe uma Viagem marcada.`,
            color: 'danger',
         });
         // showAlert('danger', `Erro ao buscar o registro:`);
         return;
      }

      const confirmacao = await abreModalNotificarMotorista(
         inscricaoId,
         viagemId
      );

      if (!confirmacao) {
         console.log('Usuário cancelou envio de e-mail.');
         return;
      }

      try {
         console.log(
            'Envia E-mail ao Motorista. Está enviando fixo para meu gmail. Precisa terminar o texto do email',
            inscricaoId
         );
         await api.post(`viagem/ntfMotorista`);

         showToast({
            title: 'Sucesso',
            message: `Notificou o Motorista da Viagem ${viagemId} de Traslado Chegada da Inscrição ${inscricaoId} com sucesso!`,
         });
      } catch (error) {
         if (error.response?.status === 422) {
            regiaoFormErros.value = error.response.data.errors || {};
         }
      }
   }

   if (action == 'marcarViagem') {
      // console.log('marcarViagem: ', row, action, dataset, target);
      // console.log('marcarViagem: ', row.pessoa.nome_completo);
      // criar as refs(), ex: viagemChegadaFormDados.value (ver acima)
      // carregar os dados: pode usar o mesmos da row DataTables recebidos ou carregar via get

      inscricaoDados.value = `<b>${
         row?.pessoa.nome_completo || 'Sem Nome'
      }</b> <br/>${row.funcao?.sigla || 'Papel não definido'} - ${
         row.pessoa.entidade?.sigla || 'Entidade Não definida'
      }`;

      // viagemChegadaInscricao.value = `<b>${row.pessoa.nome_completo}</b><br/>${row.funcao?.sigla||'Papel não definido'} - ${row.pessoa.entidade?.sigla || 'Entidade Não definida' }<br/><b>CHEGADA</b>: ${formatToBrDateTime(row?.chegada_data_hora ||"")} ${row?.chegada_meio_transp || ""} ${row?.chegada_cia_transp||""}`;
      viagemChegadaInscricao.value =
         inscricaoDados.value +
         `<br/><b>CHEGADA</b>: ${formatToBrDateTime(
            row?.chegada_data_hora || ''
         )} ${row?.chegada_meio_transp || ''} ${row?.chegada_cia_transp || ''}`;

      viagemChegadaEscolhida.value = 'A viagem não está marcada';
      if (dataset.viagemId) {
         const viagem = await api.get(
            `/inscricao/viagemmarcada/${dataset.viagemId}`
         );

         viagemChegadaEscolhida.value = `
            <b>Evento</b>: ${viagem.data.evento_nome || 'Não Informado'} <br/>
               <b>Rota</b>:   ${viagem.data.nome || 'Não Informada'} <br/>
               <b>Viagem</b>: ${viagem.data.data_hora_br} - ${
            viagem.data.descricao
         } - <br/><br/>
               <b>Rota</b>:       ${viagem.data.nome || '?'}<br/>
               <b>Veículo</b>:    ${viagem.data.descricao || '?'} <br/>
               <b>Observação</b>: ${viagem.data.observacao || '?'} <br/>
               <b>Capacidade</b>: ${viagem.data.capacidade || '?'} <br/>
               <b>Lotado com</b>: ${viagem.data.lotacao || '?'} <br/>
               <b>Vagas</b>:      ${viagem.data.vagas || '?'} <br/>
         `;
      }

      viagemChegadaFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      editarViagemChegada();
   }
};

function abreModalNotificarMotorista(inscricaoId, viagemId) {
   return new Promise((resolve, reject) => {
      notificarMotoristaModal.value = true;

      // Armazene os "resolve/reject" em refs ou variáveis acessíveis no botão do modal
      confirmarEnvio.value = () => {
         notificarMotoristaModal.value = false;
         resolve(true);
      };

      cancelarEnvio.value = () => {
         notificarMotoristaModal.value = false;
         resolve(false);
      };
   });
}

const fetchViagensPorRota = async (rotaId) => {
   try {
      // console.log('fetchViagensPorRota', rotaId);
      viagensDaRota.value = []; // limpa anterior
      const res = await api.get(`/viagem`, {
         params: { rota_id: rotaId, evento_id: currentEvent.value?.id ?? '' },
      });
      viagensDaRota.value = res.data;
   } catch (err) {
      console.error('Erro ao buscar viagens:', err);
   }
};

const editarViagemChegada = async () => {
   // Aqui você pode implementar a lógica para editar
   // ou já usamos os dados do formulário preenchidos
   // console.log('Editar:', viagemChegadaFormDados.value);
   // ou aqui poderia chamar uma API para buscar os dados da região pelo ID
   fetchRotas(currentEvent.value?.id ?? '', 'Chegada');
   rotaSelecionada.value = false;
   viagemSelecionada.value = false;
   viagemChegadaShowModal.value = true;
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarViagemChegada = async (viagemId) => {
   const inscricaoId = viagemChegadaFormDados.value?.id;
   // console.log('Salvar salvarViagemChegada:', inscricaoId,viagemId );

   if (!inscricaoId || !viagemId) {
      showToast({
         title: 'Alerta',
         message: `O código da Inscrição ${inscricaoId} e o da Viagem ${viagemId} são obrigatórios!`,
         color: 'danger',
      });
      return;
   }

   try {
      const res = await api.put(`/inscricao/alternarchegada/${inscricaoId}`, {
         viagem_id: viagemId,
      });

      if (viagemId == 'remove') {
         showToast({
            title: 'Alerta',
            message: res.data.message,
            // message: `Removeu a Viagem ID ${inscricaoId} do Traslado de Chegada com sucesso!`,
         });
         viagemChegadaEscolhida.value = `Viagem de Traslado de Chegada não selecionada.`;
      } else {
         showToast({
            title: 'Alerta',
            message: res.data.message,
            // message: `Inseriu a Viagem ID ${inscricaoId} do Traslado de Chegada com sucesso!`,
         });

         const viagem = await api.get(`/inscricao/viagemmarcada/${viagemId}`);
         // console.log('Resposta do servidor:', viagem.data.message);

         viagemChegadaEscolhida.value = `
            <b>Evento</b>: ${viagem.data.evento_nome || 'Não Informado'} <br/>
            <b>Rota</b>:   ${viagem.data.nome || 'Não Informada'} <br/>
            <b>Viagem</b>: ${viagem.data.data_hora_br} - ${
            viagem.data.descricao
         } - <br/><br/>

            <b>Rota</b>:       ${viagem.data.nome || '?'}<br/>
            <b>Veículo</b>:    ${viagem.data.descricao || '?'} <br/>
            <b>Observação</b>: ${viagem.data.observacao || '?'} <br/>
            <b>Capacidade</b>: ${viagem.data.capacidade || '?'} <br/>
            <b>Lotado com</b>: ${viagem.data.lotacao || '?'} <br/>
            <b>Vagas</b>:      ${viagem.data.vagas || '?'} <br/>
         `;
      }

      chamarRefresh();
   } catch (error) {}
};
</script>
