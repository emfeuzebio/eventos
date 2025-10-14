<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      title="Cadastro de Inscrições "
      description=" - Gerenciamento do cadastro de Inscrições de Pessoas em Eventos.
         <br>Usuários <b>Gerentes de Secretaria</b> podem incluir, editar, excluir e desativar inscrições. 
         <br>Usuários da <b>Equipe de Secretaria</b> podem editar campos específicos das inscrições."
      modalSize="xxl"
      modalFullscreen="fullscreen"
      endpoint="inscricao"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :columnActionsWidth="190"
      :abilities="abilities"
      @extraAction="onExtraAction"
      ref="crudRef"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->

         <CCard>
            <CCardBody>
               <!-- Identificação da Inscrição -->
               <CAccordion :active-item-key="1" always-open>
                  <CAccordionItem :item-key="1">
                     <CAccordionHeader>
                        <strong>Identificação da Inscrição</strong> - somente
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
                           <CCol sm="7">
                              <CFormSelect
                                 v-model="form.value.evento_id"
                                 :options="[
                                    { value: '', label: 'Selecione o Evento' },
                                    ...(todosEventos || [])
                                       .filter((ev) =>
                                          form.value.ativo === 'SIM'
                                             ? ev.ativo === 'SIM'
                                             : true
                                       )
                                       .map((ev) => ({
                                          value: ev.id,
                                          label: ev.nome,
                                       })),
                                 ]"
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.evento_id"
                              >
                                 {{ errors.value.evento_id[0] }}
                              </div>
                           </CCol>
                        </CRow>

                        <!-- Pessoa -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Nome do(a) Pessoa Participante</CFormLabel
                           >
                           <CCol sm="7">
                              <CoreUIMultiselect
                                 v-model="form.value.pessoa_id"
                                 :options="[
                                    { value: '', label: 'Selecione a Pessoa' },
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
                              >Função/Categoria de Participação</CFormLabel
                           >
                           <CCol sm="7">
                              <CoreUIMultiselect
                                 v-model="form.value.funcao_id"
                                 :options="[
                                    {
                                       value: '',
                                       label: 'Selecione a Categoria de Participação',
                                    },
                                    ...funcoes.map((funcao) => ({
                                       value: funcao.id,
                                       label: funcao.descricao,
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
                           <CCol sm="7">
                              <CFormSelect
                                 v-model="form.value.modalidade"
                                 :options="[
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
                           <CCol sm="7">
                              <CFormSelect
                                 v-model="form.value.credenciou"
                                 :options="[
                                    { value: 'NÃO', label: 'NÃO' },
                                    { value: 'SIM', label: 'SIM' },
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
                           <CCol sm="7">
                              <CFormTextarea
                                 v-model="form.value.observacao"
                                 :class="{ 'is-invalid': errors.observacao }"
                                 rows="2"
                                 placeholder="Observações pertinentes se houverem..."
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

               <!-- Opções de Transporte Chegada e Partida de Brasília -->
               <CAccordion
                  :active-item-key="1"
                  always-open
                  style="margin-top: 16px"
               >
                  <!-- Transporte Chegada e Partida de Brasília -->
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
                           como no percurso Hotel – FEB – Hotel durante os dias
                           do evento. O traslado é oferecido somente para o
                           hotel contratado para o evento.
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
                              <!-- Chegada Meio de Transporte -->
                              <CCol sm="3">
                                 <CFormLabel
                                    class="form-label fw-bold text-center"
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

                              <!-- Chegada Cia e Número -->
                              <CCol sm="3">
                                 <CFormLabel
                                    class="form-label fw-bold text-center"
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
                                 <CFormLabel
                                    class="form-label fw-bold text-center"
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
                           <!-- PARTIDA -->
                           <CRow
                              class="form-group mx-auto"
                              style="
                                 margin-top: 16px;
                                 width: 80%;
                                 justify-content: flex-center;
                              "
                           >
                              <!-- Partida Meio de Transporte -->
                              <CCol sm="3">
                                 <CFormLabel
                                    class="form-label fw-bold text-center"
                                    >Partida Meio Transporte</CFormLabel
                                 >
                                 <CFormSelect
                                    v-model="form.value.partida_meio_transp"
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
                                    v-if="errors.value.partida_meio_transp"
                                 >
                                    {{ errors.value.partida_meio_transp[0] }}
                                 </div>
                              </CCol>

                              <!-- Partida Cia e Número -->
                              <CCol sm="3">
                                 <CFormLabel
                                    class="form-label fw-bold text-center"
                                    >Partida Companhia + Nº</CFormLabel
                                 >
                                 <CFormInput
                                    v-model="form.value.partida_cia_transp"
                                    :class="{
                                       'is-invalid': errors.partida_cia_transp,
                                    }"
                                 />
                                 <div
                                    class="form-error"
                                    v-if="errors.value.partida_cia_transp"
                                 >
                                    {{ errors.value.partida_cia_transp[0] }}
                                 </div>
                              </CCol>

                              <!-- Chegada Data/Hora -->
                              <CCol sm="3">
                                 <CFormLabel
                                    class="form-label fw-bold text-center"
                                    >Partida Data/Hora</CFormLabel
                                 >
                                 <CFormInput
                                    v-model="form.value.partida_data_hora"
                                    type="datetime-local"
                                    :class="{
                                       'is-invalid': errors.partida_data_hora,
                                    }"
                                 />
                                 <div
                                    class="form-error"
                                    v-if="errors.value.partida_data_hora"
                                 >
                                    {{ errors.value.partida_data_hora[0] }}
                                 </div>
                              </CCol>
                           </CRow>
                        </CAccordionBody>
                     </CAccordionItem>
                  </CAccordion>
               </CAccordion>

               <!-- Opções para Refeições -->
               <CAccordion
                  :active-item-key="1"
                  always-open
                  style="margin-top: 16px"
               >
                  <CAccordion
                     :active-item-key="1"
                     always-open
                     style="margin-top: 16px"
                  >
                     <CAccordionItem :item-key="1">
                        <CAccordionHeader
                           ><strong>Opções para Refeições </strong>
                           A FEB oferecerá refeição aos participantes do evento,
                           considerando café da manhã, lanches de intervalos,
                           almoço e jantar.
                        </CAccordionHeader>
                        <CAccordionBody>
                           <CRow
                              class="form-group mx-auto"
                              style="
                                 margin-top: 16px;
                                 width: 300%;
                                 justify-content: flex-center;
                              "
                           >
                              <CCol>
                                 <CFormLabel
                                    class="form-label fw-bold text-left"
                                 >
                                    Marque a opção que deseja
                                 </CFormLabel>
                                 <div>
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_refeicao"
                                       id="custeio_refeicao1"
                                       value="Custeada pela FEB"
                                       label="Farei as refeições oferecidas pela FEB..."
                                       :checked="
                                          form.value.custeio_refeicao ===
                                          'Custeada pela FEB'
                                       "
                                       @change="
                                          form.value.custeio_refeicao =
                                             'Custeada pela FEB'
                                       "
                                    />
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_refeicao"
                                       id="custeio_refeicao2"
                                       value="Não solicitada"
                                       label="Não farei as refeições na FEB"
                                       :checked="
                                          form.value.custeio_refeicao ===
                                          'Não solicitada'
                                       "
                                       @change="
                                          form.value.custeio_refeicao =
                                             'Não solicitada'
                                       "
                                    />
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_refeicao"
                                       id="custeio_refeicao3"
                                       value="Paga pela Pessoa"
                                       label="Colaborarei para o custeio..."
                                       :checked="
                                          form.value.custeio_refeicao ===
                                          'Paga pela Pessoa'
                                       "
                                       @change="
                                          form.value.custeio_refeicao =
                                             'Paga pela Pessoa'
                                       "
                                    />
                                    <div class="d-flex align-items-center">
                                       <div class="form-check form-switch me-2">
                                          <CFormCheck
                                             type="checkbox"
                                             class="form-check-input"
                                             :checked="
                                                form.value
                                                   .alimentacao_restrita ===
                                                'SIM'
                                             "
                                             @change="
                                                form.value.alimentacao_restrita =
                                                   $event.target.checked
                                                      ? 'SIM'
                                                      : 'NÃO'
                                             "
                                          />
                                       </div>
                                       <span class="text-dark">
                                          Possui alguma restrição alimentar?
                                       </span>
                                    </div>
                                    <br />
                                    <div class="d-flex align-items-center">
                                       <div
                                          class="form-check form-switch form-switch-lg"
                                       >
                                          <CFormCheck
                                             type="checkbox"
                                             class="form-check-input"
                                             :checked="
                                                form.value
                                                   .alimentacao_vegevega ===
                                                'SIM'
                                             "
                                             @change="
                                                form.value.alimentacao_vegevega =
                                                   $event.target.checked
                                                      ? 'SIM'
                                                      : 'NÃO'
                                             "
                                          />
                                       </div>
                                       <span class="text-dark">
                                          Adota alimentação vegetariana ou
                                          vegana?
                                       </span>
                                    </div>
                                 </div>

                                 <div
                                    class="form-error"
                                    v-if="errors.value.custeio_refeicao"
                                 >
                                    {{ errors.value.custeio_refeicao[0] }}
                                 </div>
                              </CCol>
                           </CRow>
                        </CAccordionBody>
                     </CAccordionItem>
                  </CAccordion>
               </CAccordion>

               <!-- Opções para Hospedagem -->
               <CAccordion
                  :active-item-key="1"
                  always-open
                  style="margin-top: 16px"
               >
                  <CAccordion
                     :active-item-key="1"
                     always-open
                     style="margin-top: 16px"
                  >
                     <CAccordionItem :item-key="1">
                        <CAccordionHeader
                           ><strong>Opções para Hospedagem </strong>
                           A FEB oferecerá hospedagem aos participantes do
                           evento, considerando 2 vagas por Entidade Federativa
                           Estadual, 2 vagas para os representantes do Fórum das
                           Entidades Especializadas, Coordenadores Nacionais de
                           Área não residentes em Brasília, Secretários
                           Regionais, Secretários do CFN e convidados. Os demais
                           participantes autorizados custearão as próprias
                           despesas de hospedagem.
                        </CAccordionHeader>
                        <CAccordionBody>
                           <CRow
                              class="form-group mx-auto"
                              style="
                                 margin-top: 16px;
                                 width: 300%;
                                 justify-content: flex-center;
                              "
                           >
                              <CCol>
                                 <CFormLabel
                                    class="form-label fw-bold text-left"
                                 >
                                    Marque a opção que deseja
                                 </CFormLabel>
                                 <div>
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_hospedagem"
                                       value="Custeada pela FEB"
                                       label="Ocuparei uma das duas vagas no quarto duplo que a FEB oferece para cada Federativa Estadual ou funções descritas acima."
                                       :checked="
                                          form.value.custeio_hospedagem ===
                                          'Custeada pela FEB'
                                       "
                                       @change="
                                          form.value.custeio_hospedagem =
                                             'Custeada pela FEB'
                                       "
                                    /><br />
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_hospedagem"
                                       value="Não solicitada"
                                       label="Não utilizarei hospedagem oferecida pela FEB."
                                       :checked="
                                          form.value.custeio_hospedagem ===
                                          'Não solicitada'
                                       "
                                       @change="
                                          form.value.custeio_hospedagem =
                                             'Não solicitada'
                                       "
                                    /><br />
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_hospedagem"
                                       value="Paga pela Pessoa"
                                       label="Ocuparei vaga em quarto single, custeando a diferença equivalente ao quarto duplo oferecido pela FEB, tendo sido autorizado pela comissão organizadora."
                                       :checked="
                                          form.value.custeio_hospedagem ===
                                          'Paga pela Pessoa'
                                       "
                                       @change="
                                          form.value.custeio_hospedagem =
                                             'Paga pela Pessoa'
                                       "
                                    />
                                 </div>
                                 <div
                                    class="form-error"
                                    v-if="errors.value.custeio_hospedagem"
                                 >
                                    {{ errors.value.custeio_hospedagem[0] }}
                                 </div>
                              </CCol>
                           </CRow>
                        </CAccordionBody>
                     </CAccordionItem>
                  </CAccordion>
               </CAccordion>

               <!-- Opções para Serviços -->
               <CAccordion
                  :active-item-key="1"
                  always-open
                  style="margin-top: 16px"
               >
                  <CAccordion
                     :active-item-key="1"
                     always-open
                     style="margin-top: 16px"
                  >
                     <CAccordionItem :item-key="1">
                        <CAccordionHeader
                           ><strong
                              >Serviços solicitados por Dia de Evento
                           </strong>
                           Marque SIM nos serviços que você utilizará em cada
                           dia do evento: <br />Nota 1: a hospedagem refere-se
                           tanto para o hotel designado quanto para a hospedagem
                           no Ed. Colmeia. <br />Nota 2: o café refere-se
                           somente à hospedagem no Ed. Colmeia.
                        </CAccordionHeader>
                        <CAccordionBody>
                           <CRow
                              class="form-group mx-auto"
                              style="
                                 margin-top: 16px;
                                 width: 300%;
                                 justify-content: flex-center;
                              "
                           >
                           </CRow>
                        </CAccordionBody>
                     </CAccordionItem>
                  </CAccordion>
               </CAccordion>
            </CCardBody>
         </CCard>
      </template>
   </GenericCrud>
</template>

<script setup>
import { ref, toRaw, computed, reactive } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import api from '@/services/api';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import { formatToBrDateTime } from '@/utils/dateFormat';
import DataTablesLib from 'datatables.net-bs5';

const custeio_refeicao = reactive();

import { useCurrentEventStore } from '@/stores/currentEvent';

// vamos pegar o Evento Selecionado
const eventStore = useCurrentEventStore();
const currentEvent = computed(() => eventStore.getEvent);
// console.log('Inscrição currentEvent:', currentEvent.value);

// define a Entidade Principal da View
const entity = 'inscricao';

const { showToast } = useToast(); // Toasts de Alerta

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

const crudRef = ref(null);

import { useEventos } from '@/composables/useEventos';
const {
   fetchEntidades,
   entidades,
   fetchFuncoes,
   funcoes,
   fetchPessoas,
   pessoas,
   fetchtodosEventos,
   todosEventos,
} = useEventos();

fetchtodosEventos();
fetchEntidades();
fetchFuncoes();
fetchPessoas();

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
   ativo: 'SIM',
   // custeio_refeicao: '',
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

/**
 * BASE Crud - botões padrão - aqui você pode desativer botões básicos do CRUD.
 * Default: true para todos
 */
const buttons = { update: true, delete: true, show: false };

/**
 * BASE Crud - Filtros da tabela de dados
 * Necessário que a API receba o parametro enviado no GET e aplique o filtro where requerido
 */
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

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
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
