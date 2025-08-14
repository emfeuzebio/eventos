<template>
   <GenericCrud
      ref="crudRef"
      modalSize="xxl"
      modalFullscreen="fullscreen"
      title="Gestão de Hospedagem "
      description="Gestão das Inscrições que solicitaram Hospedagem, inscritas no Evento selecionado acima"
      endpoint="inscricao"
      columnActionsWidth="450px"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :abilities="abilities"
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

   <!-- Marcar Quarto de Hotel  | Extra Modal Especializado -->
   <CModal
      :visible="marcarQuartoHotelModal"
      @close="marcarQuartoHotelModal = false"
      backdrop="static"
   >
      <CModalHeader>
         <strong>Marcar Quarto de Hortel</strong>
      </CModalHeader>
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Dados da Inscrição</label>
         <CAlert color="primary" v-html="inscricaoDados"></CAlert>

         <label class="form-label fw-bold">Selecione o Quarto</label>
         <CFormSelect
            v-model="quartoSelecionado"
            :options="[
               { value: '', label: 'Desmarcar o Quarto atual' },
               ...quartosAtivosDoEvento.map((quarto) => ({
                  value: quarto.id,
                  label: quarto.descricao,
               })),
            ]"
         />

         <label class="form-label fw-bold mb-1 mt-2"
            >Dados da Hospedagem marcada</label
         >
         <!-- <CAlert color="dark" v-html="viagemChegadaInscricao"></CAlert> -->
         <CAlert color="dark" v-html="hospedagemEscolhida"></CAlert>
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="marcarQuartoHotelModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <CButton
            color="btn btn-primary btn-sm me-1"
            @click="salvarQuartoNaInscricao(quartoSelecionado)"
            >Salvar</CButton
         >
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { ref, toRaw, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import { formatToBrDateTime } from '@/utils/dateFormat';
import { useGlobalError } from '@/composables/useGlobalError';
import api from '@/services/api';

import DataTablesLib from 'datatables.net-bs5';

// Vamos obter a lista de Eventos Ativo e o Corrente do store store
import { useCurrentEventStore } from '@/stores/currentEvent';
const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);
// const currentEventId = currentEvent.value?.id ?? '';
// console.log('currentEventId:', currentEventId);

const { showError } = useGlobalError(); // Modal de Erros

// define a Entidade Principal da View
const entity = 'inscricao';

const { showToast } = useToast(); // Toasts de Alerta

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

const canPrint = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update' é verdadeiro
// console.log('canPrint:', canPrint); // Isso deve ser true ou false

// DEBUG de todas abilities do User Logado
// console.log(`Abilities carregadas da entidade '${entity}'':`, abilities);

const crudRef = ref(null);

function chamarRefresh() {
   crudRef.value?.refreshTable();
}

/**
 * BASE Crud - colunas da tabela de dados
 */
const columns = [
   { title: 'ID', data: 'id', width: '50px' },
   {
      title: 'Pessoa | Entidade | Papel | Modalidade | Chegada | Traslado ',
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
            row.viagem_chegada?.veiculo.descricao || 'Veículo Não definido';

         return `<span class="fw-bold">${nome}</span> <small class="text-muted">${entidade_sigla}</small> <br/>
                     <small class="text-muted">${papel} - ${modalidade}</small> <br/>
                     <span class="fw-bold">Chegada</span> <br/>
                     <small class="text-muted">${chegada_data_hora}</small> >
                     <small class="text-muted">${chegada_meio_transp}</small>
                     <small class="text-muted">${chegada_cia_transp}</small> <br/> 
                     <span class="fw-bold">Traslado</span> ${row.chegada_traslado} <br/>	
                     <small class="text-muted">${chegada_veiculo}</small> 
               `;
      },
      className: 'text-left',
      width: 'auto',
   },
   // { title: 'Ativo', data: 'ativo', width: '60px' },
];

/**
 * BASE Crud - Valores padrão dos campos do formulário
 */
const defaultValues = {
   entidade_id: null,
   nome_completo: '',
   ativo: 'SIM',
};

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso - recupera as abilities do usuário logado na ação
   const canHospedar = abilities.includes('inscricao.chkhospedou')
      ? ''
      : 'disabled';

   const canMarcarQuarto = abilities.includes('inscricao.marcarquarto')
      ? ''
      : 'disabled';

   // trasposição do checkbox para os dados da linha
   const isCheckedCheckin = row.hotel_checkin === 'SIM' ? 'checked' : '';
   const isCheckedCheckout = row.hotel_checkout === 'SIM' ? 'checked' : '';

   const custeioHospedagem = row.custeio_hospedagem ?? 'Sem informação';
   const hotel = row.quarto?.hotel?.nome ?? 'Não definido';
   const quarto = row.quarto?.numero ?? 'Não definido';
   const quartoHotel = row.quarto?.numero_hotel ?? '';
   // const quartoCapacidade = row.quarto?.capacidade ?? '';
   const quartoCapacidade = row.quarto ? `(${row.quarto.capacidade})` : '';
   const quartoTipo = row.quarto?.quarto_tipo?.nome ?? '';
   const pessoaIndicada = row.pessoa_indicada_hotel?.nome_completo ?? 'Nenhum';

   return `
   <div class="d-flex flex-column w-100">

      <!-- Primeira linha -->
      <div class="d-flex w-100 mb-2">
         <div class="d-flex justify-content-start align-items-center" style="width: 30%;">
            <label style="padding-right: 4px;">Check-in</label> 
            <div class="form-check form-switch">
               <input class="form-check-input" ${canHospedar} data-custom-action="hotelCheckin" type="checkbox" data-inscricao-id="${row.id}" ${isCheckedCheckin}>
            </div>
         </div>

         <!-- Botão Selecionar Quarto (70%) -->
         <div class="d-flex justify-content-center align-items-center" style="width: 40%;">
            <button class="btn btn-xs btn-outline-primary" ${canMarcarQuarto} data-custom-action="selecionarQuartoHotel" data-inscricao-id="${row.id}">
               Selecionar Quarto
            </button>
         </div>

         <div class="d-flex justify-content-end align-items-center" style="width: 30%;">
            <div class="form-check form-switch">
               <input class="form-check-input" ${canHospedar} data-custom-action="hotelCheckout" type="checkbox" data-inscricao-id="${row.id}" ${isCheckedCheckout}>
            </div>
            <label style="padding-right: 4px;">Check-Out</label> 
         </div>
      </div>

      <!-- Segunda linha -->
      <div class="d-flex w-100">
         <div class="w-100">
            <span class="text-muted">Tipo</span> <small class="fw-bold">${custeioHospedagem}</small><br/>
            <span class="text-muted">Hotel</span> <small class="fw-bold">${hotel}</small><br/>
            <span class="text-muted">Quarto</span> <small class="fw-bold">${quarto} ${quartoHotel} ${quartoTipo} ${quartoCapacidade}</small><br/>
            <span class="text-muted">Acompanhante Sugerido</span> <small class="fw-bold">${pessoaIndicada}</small><br/>
         </div>
      </div>

   </div>
   `;
};

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const marcarQuartoHotelModal = ref(false);
const hospedagemEscolhida = ref('');
const inscricaoDados = ref('');
const errorMessage = ref('');

const quartoSelecionado = ref(''); // ID da rota selecionada
const inscricaoSelecionada = ref(''); // ID da viagem selecionada
const quartosAtivosDoEvento = ref([]); // quartosAtivosDoEvento

/**
 * ESPECIALIZAÇÃO CRUD: recupera da API listas de dados necessários para o CRUD
 * ex.: lista de Regiões do País
 *       lista de Cidades
 *       lista de Categorias
 */
import { useEventos } from '@/composables/useEventos';
import { color } from 'chart.js/helpers';
const {
   fetchEntidades,
   funcoes,
   pessoas,
   marcarHotelCheckin,
   marcarHotelCheckout,
} = useEventos();
fetchEntidades();

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
// const filters = [{}]; // nessse caso sem filtros

const filters = computed(() => [
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
      label: 'Tipo de Hospedagem',
      field: 'custeio_hospedagem',
      type: 'select',
      default: 'Na FEB,Custeada pela FEB,Paga pela Pessoa',
      options: [
         { value: 'Não solicitada', label: 'Não solicitada' },
         {
            value: 'Na FEB,Custeada pela FEB,Paga pela Pessoa',
            label: 'Todas Solicitadas',
         },
         { value: 'Na FEB', label: 'Na FEB' },
         { value: 'Custeada pela FEB', label: 'Custeada pela FEB' },
         { value: 'Paga pela Pessoa', label: 'Paga pela Pessoa' },
      ],
   },
]);

// {
//    label: 'Entidade',
//    field: 'pessoa__entidade_id', // '__' duplo para enganar o PHP que converte o . para _ nas URL
//    type: 'select',
//    options: entidades.value.map((entidade) => ({
//       value: entidade.id,
//       label: entidade.sigla,
//    })),
// },

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   if (action == 'hotelCheckin') {
      const inscricaoId = row.id;
      const isChecked = target[0].checked ? 'SIM' : 'NÃO';

      if (!row.evento || row.evento.ativo !== 'SIM') {
         showError(
            'Somente <b>Inscrições de Eventos ATIVOS</b> podem ter Check-In marcados.'
         );
         return;
      }

      if (!row.hotel_quarto_id) {
         showError(
            '<b>Impossível fazer Check-In</b> sem primeiro marcar um Quarto de Hotel na Inscrição.'
         );
         return;
      }

      if (!row.hotel_checkout || row.hotel_checkout == 'SIM') {
         showError(
            '<b>Impossível desfazer o Check-In</b> sem primeiro defazer o <b>Check-Out</b> no Hotel.'
         );
         return;
      }

      const sucesso = await marcarHotelCheckin(inscricaoId, {
         hotel_checkin: isChecked,
      });

      if (sucesso) {
         showToast({
            title: 'Sucesso',
            message: `Efetuou Check-In ${isChecked} no Hotel da Inscrição ${inscricaoId} com sucesso!`,
         });
      }
      chamarRefresh();
   }

   if (action == 'hotelCheckout') {
      const inscricaoId = row.id;
      const isChecked = target[0].checked ? 'SIM' : 'NÃO';

      if (!row.evento || row.evento.ativo !== 'SIM') {
         showError(
            'Somente <b>Inscrições de Eventos ATIVOS</b> podem ter Check-Out marcados.'
         );
         return;
      }

      if (!row.hotel_quarto_id) {
         showError(
            '<b>Impossível fazer Check-Out</b> sem primeiro marcar um Quarto de Hotel na Inscrição.'
         );
         return;
      }

      if (!row.hotel_checkin || row.hotel_checkin !== 'SIM') {
         showError(
            '<b>Impossível fazer Check-Out</b> sem primeiro ter feito o <b>Check-In</b> no Hotel.'
         );
         return;
      }

      // estou usando o 'clear' abaixo porque criei a rota no api e ela não é reconhecida:
      // Se você adicionou ou mudou algo em routes/api.php, siga essa ordem:
      // php artisan route:clear
      // const clear = await api.get(`/routeclear`); // está no web da api
      // depois do comando acima
      // login responde: error "ACL response Invalid Token"
      // houve uma vez que horas depois do 'clear' tudo voltou a funcionar
      // até não sei o motivo

      const sucesso = await api.put(
         `/inscricao/marcarcheckout/${inscricaoId}`,
         { hotel_checkout: isChecked }
      );

      if (sucesso) {
         showToast({
            title: 'Sucesso',
            message: `Efetuou Check-Out ${isChecked} no Hotel da Inscrição ${inscricaoId} com sucesso!`,
         });
      }
      chamarRefresh();
   }

   if (action == 'selecionarQuartoHotel') {
      const inscricaoId = row.id; // pega o data da DT linha
      const eventoId = currentEvent.value?.id ?? '';
      const quartoId = dataset.quartoId; // pega o data('quarto-id') do <select>
      // console.log('selecionarQuartoHotel: ', row, action, dataset, target);

      // se a Inscrição estiver INATIVA
      if (row.ativo == 'NÃO') {
         showError(
            '<b>Impossível selecionar Quarto</b> para uma Inscrição <b>NÃO ATIVA</b>.'
         );
         return;
      }

      // Se o Evento da Inscrição não estiver ativo
      if (!row.evento || row.evento.ativo !== 'SIM') {
         showError(
            'Somente <b>Inscrições de Eventos ATIVOS</b> podem ter seus Quartos editados.'
         );
         return;
      }

      // A Inscrição NÃO solicitou Hospedagem, portanto não é possível selecionar um Quarto.
      if (row.custeio_hospedagem == 'Não solicitada') {
         showError(
            `Esta Inscrição ID ${inscricaoId} <b>NÃO solicitou Hospedagem</b>, portanto não é possível selecionar um Quarto.`
         );
         return;
      }

      // TODO se a Inscrição não estiver ativa
      // if (row.ativo != 'SIM') {
      //    showError(
      //       'Somente uma <b>Inscrição ATIVA</b> pode ter seus Quartos editados.'
      //    );
      //    return;
      // }

      inscricaoDados.value = `<b>${
         row?.pessoa.nome_completo || 'Sem Nome'
      }</b> <br/>${row.funcao?.descricao || 'Papel não definido'} - ${
         row.pessoa.entidade?.sigla || 'Entidade Não definida'
      } - ${row.modalidade || 'Não informada'}<br/> <b>Chegada</b><br/>
      ${formatToBrDateTime(
         row.chegada_data_hora || 'Data-Hora Não definida'
      )} <br/> 
      ${row.chegada_meio_transp || 'Meio Não definido'} > ${
         row.chegada_cia_transp || ''
      } <br> <b>Traslado</b> ${row.chegada_traslado} Solicitado <br/>
      ${row.viagem_chegada?.veiculo.descricao || ''}`;

      hospedagemEscolhida.value = 'A Hospedagem não está marcada';
      hospedagemEscolhida.value = `
            <b>Evento</b>:  ${row.evento?.sigla || 'Não Informado'} <br/>
            <b>Tipo</b>:    ${row.custeio_hospedagem ?? 'Sem informação'} <br/>
            <b>Hotel</b>:   ${row.quarto?.hotel?.nome ?? ''} <br/>
            <b>Quarto</b>:  ${row.quarto?.numero ?? ''} ${
         row.quarto?.numero_hotel ?? ''
      } ${row.quarto?.quarto_tipo?.nome ?? ''} ${
         row.quarto?.capacidade ?? ''
      }<br/>
            <b>Acompanhante Sugerido</b>: ${
               row.pessoa_indicada_hotel?.nome_completo || 'Nenhum'
            } <br/>
         `;

      quartosAtivosDoEvento.value = (
         await api.get(`/quarto/quartosativos/${eventoId}`)
      ).data;

      marcarQuartoHotelModal.value = true;
      inscricaoSelecionada.value = inscricaoId;
      quartoSelecionado.value = row.hotel_quarto_id;
   }
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarQuartoNaInscricao = async (quartoId) => {
   const inscricaoId = inscricaoSelecionada.value;

   var sucesso = false;

   try {
      sucesso = await api.put(`/inscricao/marcarquarto/${inscricaoId}`, {
         hotel_quarto_id: quartoId,
      });
   } catch (error) {
      if (error.response?.status === 422) {
         const errors = error.response.data.errors;
         errorMessage.value = formatValidationErrors(errors); // captura a lista de erros e põe numa string

         showError(errorMessage.value);
      }
   }

   if (sucesso) {
      showToast({
         title: 'Sucesso',
         message: `Marcado o Quarto ${quartoId} na Inscrição ${inscricaoId} com sucesso!`,
      });

      marcarQuartoHotelModal.value = false;
      chamarRefresh();
   }
};

function formatValidationErrors(errors) {
   const mensagens = [];

   for (const [campo, msgs] of Object.entries(errors)) {
      msgs.forEach((msg) => mensagens.push(msg));
   }

   // Quebra de linha HTML para uso com v-html
   return mensagens.join('<br/>');
}
</script>
