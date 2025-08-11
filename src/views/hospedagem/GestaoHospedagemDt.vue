<template>
   <GenericCrud
      ref="crudRef"
      modalSize="xxl"
      modalFullscreen="fullscreen"
      title="Gestão de Hospedagem "
      description="Gestão das Inscrições que solicitaram Hospedagem, inscritas no Evento selecionado acima"
      endpoint="inscricao"
      columnActionsWidth="400px"
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
         <strong>Marcar Quarto de Hortel</strong>
      </CModalHeader>
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Dados da Inscrição</label>
         <CAlert color="primary" v-html="inscricaoDados"></CAlert>

         <label class="form-label fw-bold">Selecione o Quarto</label>
         <CFormSelect
            v-model="rotaSelecionada"
            :options="[
               { value: '', label: 'Nenhum Quarto selecionado' },
               ...quartosAtivosDoEvento.map((quarto) => ({
                  value: quarto.id,
                  label: quarto.descricao,
               })),
            ]"
         />
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="viagemChegadaShowModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <CButton
            color="btn btn-primary btn-sm me-1"
            @click="salvarViagemChegada(rotaSelecionada)"
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
      title: 'Pessoa | Entidade | Papel | Modalidade',
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
                     <small class="text-muted">${chegada_cia_transp}</small> >
                     <small class="text-muted">${chegada_veiculo}</small>
               `;
      },
      className: 'text-left',
      width: 'auto',
   },
   // { title: 'Entidade', data: 'pessoa.entidade.sigla', width: '100px' },
   // { title: 'Partida', data: 'partida_meio_transp', width: '140px' },
   // {
   //    title: 'Traslado de Chegada',
   //    data: null,
   //    width: 'auto',
   //    className: 'text-center',
   //    render: function (data, type, row) {
   //       // TODO - API row não está trazndo a Viagem filha da Inscrição para obter os dados para por na Coluna Translado Chegada
   //       let text = '';
   //       if (row.viagem_chegada) {
   //          text += `${
   //             row.viagem_chegada?.rota.nome || 'Rota Não definida'
   //          } <br/>`;
   //          text += `${formatToBrDateTime(
   //             row.viagem_chegada?.data_hora || 'Data/Hora Não definida'
   //          )} <br/>`;
   //          text += `<b>${
   //             row.viagem_chegada?.veiculo.descricao || 'Veículo Não definido'
   //          } </b><br/>`;
   //       }

   //       return text;
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
   const quartoCapacidade = row.quarto?.capacidade ?? '';
   const quartoTipo = row.quarto?.quarto_tipo?.nome ?? '';
   const pessoaIndicada = 'Nenhum';

   return `
      <div class="d-flex w-100">
         <div class="d-flex justify-content-start" style="width: 15%;">
            <div class="form-check form-switch">
               <input class="form-check-input" ${canHospedar} data-custom-action="hotelCheckin" type="checkbox" data-inscricao-id="${row.id}" ${isCheckedCheckin} >
            </div>
         </div>
         <div class="d-flex justify-content-center" style="width: 70%;">

            <div>
               <button class="btn btn-xs btn-outline-primary" ${canMarcarQuarto} data-custom-action="selectQuartoHotel" 
                  data-inscricao-id="${row.id}">Selecionar Quarto
               </button> <br/>

               <span class="text-muted">Tipo</span> <small class="fw-bold">${custeioHospedagem}</small> <br/>
               <span class="text-muted">Hotel</span> <small class="fw-bold">${hotel}</small> <br/>
               <span class="text-muted">Quarto</span> <small class="fw-bold">${quarto} ${quartoHotel} ${quartoTipo} ${quartoCapacidade} </small> <br/>
               <span class="text-muted">Acompanhante Sugerido</span> <small class="fw-bold">${pessoaIndicada}</small> <br/>
            </div>

         </div>
         <div class="d-flex justify-content-end" style="width: 15%;">
            <div class="form-check form-switch">
               <input class="form-check-input" ${canHospedar} data-custom-action="hotelCheckout" type="checkbox" data-inscricao-id="${row.id}" ${isCheckedCheckout} >
            </div>
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
const inscricaoSelecionada = ref(''); // ID da viagem selecionada

const quartosAtivosDoEvento = ref([]); // quartosAtivosDoEvento

// const notificarMotoristaModal = ref(false);
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
   marcarHotelCheckin,
   marcarHotelCheckout,
} = useEventos();
// fetchEventos();
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
const filters = [{}]; // nessse caso sem filtros

// const filters = computed(() => [
//    {
//       label: 'Ativa',
//       field: 'ativo',
//       type: 'select',
//       options: [
//          { value: 'SIM', label: 'SIM' },
//          { value: 'NÃO', label: 'NÃO' },
//       ],
//    },
//    {
//       label: 'Entidade',
//       field: 'pessoa__entidade_id', // '__' duplo para enganar o PHP que converte o . para _ nas URL
//       type: 'select',
//       options: entidades.value.map((entidade) => ({
//          value: entidade.id,
//          label: entidade.sigla,
//       })),
//    },
//    {
//       label: 'Modalidade',
//       field: 'modalidade',
//       type: 'select',
//       options: [
//          { value: 'Presencial', label: 'Presencial' },
//          { value: 'Virtual', label: 'Virtual' },
//       ],
//    },
// ]);

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   if (action == 'hotelCheckin') {
      const inscricaoId = row.id;
      const isChecked = target[0].checked ? 'SIM' : 'NÃO';

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

   if (action == 'selectQuartoHotel') {
      const inscricaoId = row.id; // pega o data da DT linha
      const eventoId = currentEvent.value?.id ?? '';

      const quartoId = dataset.quartoId; // pega o data('quarto-id') do <select>
      // console.log('selectQuartoHotel: ', row, action, dataset, target);
      // console.log('selectQuartoHotel: ', dataset, target);
      // console.log('selectQuartoHotel: ', target);
      // console.log('Quarto Selecionado: ', inscricaoId, quartoId);

      // TODO
      // if (row.ativo != 'SIM') {
      //    showError(
      //       'Somente um <b>Inscrição ATIVA</b> pode ter seus Quartos editados.'
      //    );
      //    return;
      // }
      // Route::get('/quarto/quartosativos/{id}', 'quartosAtivosDoEvento')

      quartosAtivosDoEvento.value = (
         await api.get(`/quarto/quartosativos/${eventoId}`)
      ).data;

      viagemChegadaShowModal.value = true;
      inscricaoSelecionada.value = inscricaoId;

      // TODO está gavando sempre quarto_id 231, preciso pegar o id selecionado do <select>
      // const sucesso = await api.put(`/inscricao/marcarquarto/${inscricaoId}`, {
      //    hotel_quarto_id: quartoId,
      // });

      // if (sucesso) {
      //    showToast({
      //       title: 'Sucesso',
      //       message: `Marcado o Quarto ${quartoId} na Inscrição ${inscricaoId} com sucesso!`,
      //    });

      //    chamarRefresh(); // chama refreshTable() do composable via expose
      // }

      /**
       * TODO - aqui caso o request venha com ERRO dizendo que o quarto já está ocupado ou cheio há que tratar
       */
      // if (!viagemId) {
      //    showToast({
      //       title: 'Sucesso',
      //       message: `Impossível Marcar o Traslado de Chegada! Não existe uma Viagem marcada.`,
      //       color: 'danger',
      //    });
      //    return;
      // }
   }
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarViagemChegada = async (quartoId) => {
   const inscricaoId = inscricaoSelecionada.value;
   // console.log('Salvar salvarViagemChegada:', inscricaoId,viagemId );

   const sucesso = await api.put(`/inscricao/marcarquarto/${inscricaoId}`, {
      hotel_quarto_id: quartoId,
   });

   if (sucesso) {
      showToast({
         title: 'Sucesso',
         message: `Marcado o Quarto ${quartoId} na Inscrição ${inscricaoId} com sucesso!`,
      });

      viagemChegadaShowModal.value = false;
      chamarRefresh();
   }

   // try {
   //    const res = await api.put(`/inscricao/alternarchegada/${inscricaoId}`, {
   //       viagem_id: viagemId,
   //    });

   //    chamarRefresh();
   // } catch (error) {}
};
</script>
