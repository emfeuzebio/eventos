<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      title="Cadastro de Inscrições "
      description=" - Gerenciamento do cadastro de Inscrições de Pessoas em Eventos.
         <br>Usuários <b>Gerentes de Recepção</b> podem incluir, editar, excluir e desativar inscrições. 
         <br>Usuários da <b>Equipe de Recepção</b> podem editar campos específicos das inscrições."
      modalSize="xxl"
      modalFullscreen="fullscreen"
      endpoint="inscricao"
      :pageExtraButtons="pageExtraButtons"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :columnActionsWidth="190"
      :abilities="abilities"
      ref="crudRef"
      @extraAction="onExtraAction"
      @afterLoad="onAfterLoad"
      @pageExtraButtonsActions="onpageExtraButtonsActions"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->
         <!-- {{ form.value.id }} -->       

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
                        <!-- DEBUG: mostrar o evento_id atual -->
                        <div class="alert alert-secondary small">
                           Debug: evento_id = {{ form.value.evento_id }} |
                                  inscricao_id = {{ form.value.id }} |
                                  Serviços carregados: {{ servicosOfertados.length }} dias
                        </div>

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

                        <!-- Observações -->
                        <CRow class="form-group" style="margin-top: 16px">
                           <CFormLabel
                              class="col-sm-3 form-label fw-bold text-end"
                              >Necessidades Especiais?</CFormLabel
                           >
                           <CCol sm="7">
                              <CFormTextarea
                                 v-model="form.value.necessidades_especiais"
                                 :class="{ 'is-invalid': errors.necessidades_especiais }"
                                 rows="2"
                                 placeholder="Descreva suas  demandas de acessibilidade para que possamos melhor lhe atender."
                              />
                              <div
                                 class="form-error"
                                 v-if="errors.value.necessidades_especiais"
                              >
                                 {{ errors.value.necessidades_especiais[0] }}
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

                              <!-- Chegada Traslado -->
                              <CCol sm="3">
                                 <div class="text-center">
                                    <CFormLabel class="form-label fw-bold text-center"
                                    >Traslado na Chegada?</CFormLabel>
                                    <div class="form-check form-switch d-inline-block">
                                       <input
                                          type="checkbox"
                                          class="form-check-input"
                                          role="switch"
                                          :checked="form.value.chegada_traslado === 'SIM'"
                                          @change="form.value.chegada_traslado = $event.target.checked ? 'SIM' : 'NÃO'"
                                       />
                                       <span class="ms-1 small">{{
                                          form.value.chegada_traslado === 'SIM' ? 'SIM' : 'NÃO'
                                       }}</span>
                                    </div>
                                 </div>
                                 <div class="form-error" v-if="errors.value?.chegada_traslado">
                                    {{ errors.value.chegada_traslado[0] }}
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

                              <!-- Partida Companhia + Nº + Data/Hora -->
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

                              <!-- Partida Data / Hora -->
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

                              <!-- Partida Traslado -->
                              <CCol sm="3">
                                 <div class="text-center">
                                    <CFormLabel class="form-label fw-bold text-center"
                                    >Traslado na Partida?</CFormLabel>
                                    <div class="form-check form-switch d-inline-block">
                                       <input
                                          type="checkbox"
                                          class="form-check-input"
                                          role="switch"
                                          :checked="form.value.partida_traslado === 'SIM'"
                                          @change="form.value.partida_traslado = $event.target.checked ? 'SIM' : 'NÃO'"
                                       />
                                       <span class="ms-1 small">{{
                                          form.value.partida_traslado === 'SIM' ? 'SIM' : 'NÃO'
                                       }}</span>
                                    </div>
                                 </div>
                                 <div class="form-error" v-if="errors.value?.partida_traslado">
                                    {{ errors.value.partida_traslado[0] }}
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
                                       label="Farei as refeições oferecidas pela FEB. (sinalize as opções por dia no quadro abaixo, visando melhor dimensionamento da alimentação)"
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
                                       label="Colaborarei para o custeio das refeições oferecidas pela FEB (entrar em contato com a Comissão Organizadora do evento)"
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
                           <CRow class="form-group" style="margin-top: 16px">
                              <CCol sm="12">
                                 <CFormLabel class="form-label fw-bold text-left">
                                    Marque a opção que deseja
                                 </CFormLabel>
                                 
                                 <div>
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_hospedagem"
                                       value="Custeada pela FEB"
                                       label="Ocuparei uma das duas vagas no quarto duplo que a FEB oferece para cada Federativa Estadual ou funções descritas acima."
                                       :checked="form.value.custeio_hospedagem === 'Custeada pela FEB'"
                                       @change="form.value.custeio_hospedagem = 'Custeada pela FEB'"
                                    /><br />
                                    
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_hospedagem"
                                       value="Não solicitada"
                                       label="Não utilizarei hospedagem oferecida pela FEB."
                                       :checked="form.value.custeio_hospedagem === 'Não solicitada'"
                                       @change="form.value.custeio_hospedagem = 'Não solicitada'"
                                    /><br />
                                    
                                    <CFormCheck
                                       type="radio"
                                       name="custeio_hospedagem"
                                       value="Paga pela Pessoa"
                                       label="Ocuparei vaga em quarto single, custeando a diferença equivalente ao quarto duplo oferecido pela FEB, tendo sido autorizado pela comissão organizadora."
                                       :checked="form.value.custeio_hospedagem === 'Paga pela Pessoa'"
                                       @change="form.value.custeio_hospedagem = 'Paga pela Pessoa'"
                                    />
                                 </div>
                                 
                                 <div class="form-error" v-if="errors.value.custeio_hospedagem">
                                    {{ errors.value.custeio_hospedagem[0] }}
                                 </div>
                                 
                                 <!-- Divisor visual -->
                                 <hr class="my-3" />
                                 
                                 <!-- Select para dividir quarto -->
                                 <CFormLabel class="form-label fw-bold">
                                    Compartilhar o quarto com (opcional)
                                 </CFormLabel>
                                 
                                 <div class="d-block" style="max-width: 500px">
                                 <CoreUIMultiselect
                                    v-model="form.value.hotel_pessoa_indicada_id"
                                    :options="[
                                       { value: '', label: 'Selecione a pessoa' },
                                       ...pessoas.map((pessoa) => ({
                                          value: pessoa.id,
                                          label: pessoa.nome_completo,
                                       })),
                                    ]"
                                    style="max-width: 500px"
                                 /></div>
                                 
                                 <div class="form-error" v-if="errors.value?.hotel_pessoa_indicada_id">
                                    {{ errors.value.hotel_pessoa_indicada_id[0] }}
                                 </div>
                                 
                                 <small class="text-muted">
                                    Aqui você pode indicar a pessoa com quem deseja compartilhar o quarto (opcional)
                                 </small>
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
                  <CAccordionItem :item-key="1">
                     <CAccordionHeader>
                        <strong>Serviços solicitados por Dia de Evento</strong>
                        Marque SIM nos serviços que você utilizará em cada dia
                        do evento:
                        <br /><small class="text-muted">
                           Nota 1: a hospedagem refere-se tanto para o hotel
                           designado quanto para a hospedagem no Ed. Colmeia.
                           <br />
                           Nota 2: o café refere-se somente à hospedagem no Ed.
                           Colmeia.
                        </small>
                     </CAccordionHeader>
                     <CAccordionBody>

                        <!-- Alertas -->
                        <div
                           v-if="inscricaoSalva"
                           class="alert alert-info alert-dismissible fade show mb-3"
                           role="alert"
                        >
                           <i class="fas fa-info-circle me-2"></i>
                           <strong>Atenção:</strong> Salve a inscrição primeiro
                           para marcar os serviços.
                        </div>

                        <div
                           v-else-if="loadingServicos"
                           class="text-center py-4"
                        >
                           <div
                              class="spinner-border text-primary"
                              role="status"
                           >
                              <span class="visually-hidden">Carregando...</span>
                           </div>
                           <p class="mt-2 text-muted">
                              Carregando serviços disponíveis...
                           </p>
                        </div>

                        <!-- Tabela de Serviços -->
                        <div v-else-if="servicosPorDia.length > 0">
                           <div class="table-responsive">
                              <table
                                 class="table table-bordered table-hover align-middle text-nowrap"
                              >
                                 <thead class="table-light">
                                    <tr>
                                       <th
                                          class="text-center"
                                          style="min-width: 120px"
                                       >
                                          Data
                                       </th>
                                       <!-- Coluna Transporte -->
                                       <th 
                                          v-if="servicosOfertados.some(s => s.oferece_transporte === 'SIM')"
                                          class="text-center"
                                          style="min-width: 120px"
                                       >
                                       <i class="fas fa-truck me-1"></i> Transporte
                                       </th>

                                          <!-- Coluna Hospedagem -->
                                          <th 
                                          v-if="servicosOfertados.some(s => s.oferece_hospedagem === 'SIM')"
                                          class="text-center"
                                          style="min-width: 120px"
                                          >
                                          <i class="fas fa-bed me-1"></i> Hospedagem
                                          </th>

                                          <!-- Coluna Lavanderia -->
                                          <th 
                                          v-if="servicosOfertados.some(s => s.oferece_lavanderia === 'SIM')"
                                          class="text-center"
                                          style="min-width: 120px"
                                          >
                                          <i class="fas fa-tshirt me-1"></i> Lavanderia
                                          </th>

                                          <!-- Coluna Traslado -->
                                          <th 
                                          v-if="servicosOfertados.some(s => s.oferece_traslado === 'SIM')"
                                          class="text-center"
                                          style="min-width: 120px"
                                          >
                                          <i class="fas fa-bus me-1"></i> Traslado
                                          </th>

                                          <!-- Coluna Café -->
                                          <th 
                                          v-if="servicosOfertados.some(s => s.oferece_cafe === 'SIM')"
                                          class="text-center"
                                          style="min-width: 120px"
                                          >
                                          <i class="fas fa-mug-hot me-1"></i> Café
                                          </th>

                                          <!-- Coluna Almoço -->
                                          <th 
                                          v-if="servicosOfertados.some(s => s.oferece_almoco === 'SIM')"
                                          class="text-center"
                                          style="min-width: 120px"
                                          >
                                          <i class="fas fa-utensils me-1"></i> Almoço
                                          </th>

                                          <!-- Coluna Jantar -->
                                          <th 
                                          v-if="servicosOfertados.some(s => s.oferece_jantar === 'SIM')"
                                          class="text-center"
                                          style="min-width: 120px"
                                          >
                                          <i class="fas fa-moon me-1"></i> Jantar
                                          </th>
                                    </tr>
                                 </thead>
                                 
                                 <tbody>
                                    <tr
                                       v-for="servico in servicosOrdenados"
                                       :key="servico.data"
                                    >
                                       <td class="fw-bold text-center">
                                          {{ formatarData(servico.data) }}
                                       </td>

                                       <!-- Coluna Transporte (dados) -->
                                       <td v-if="servicosOfertados.some(s => s.oferece_transporte === 'SIM')" class="text-center">
                                       <div class="form-check form-switch d-inline-block">
                                          <input
                                             type="checkbox" 
                                             class="form-check-input"
                                             role="switch"
                                             :data-key="`${servico.data}_transporte`"
                                             :checked="servico.transporte === 'SIM'"
                                             :disabled="servico.transporte_disabled || savingServicoDaInscricao[`${servico.data}_transporte`]"
                                             @change="toggleServico(servico.data, 'transporte', $event.target.checked)"
                                          />
                                          <span class="ms-1 small">{{ servico.transporte === 'SIM' ? 'SIM' : 'NÃO' }}</span>
                                       </div>
                                       </td>

                                       <!-- Coluna Hospedagem (dados) -->
                                       <td v-if="servicosOfertados.some(s => s.oferece_hospedagem === 'SIM')" class="text-center">
                                       <div class="form-check form-switch d-inline-block">
                                          <input
                                             type="checkbox"
                                             class="form-check-input" 
                                             role="switch"
                                             :data-key="`${servico.data}_hospedagem`"
                                             :checked="servico.hospedagem === 'SIM'"
                                             :disabled="servico.hospedagem_disabled || savingServicoDaInscricao[`${servico.data}_hospedagem`]"
                                             @change="toggleServico(servico.data, 'hospedagem', $event.target.checked)"
                                          />
                                          <span class="ms-1 small">{{ servico.hospedagem === 'SIM' ? 'SIM' : 'NÃO' }}</span>
                                       </div>
                                       </td>

                                       <!-- Coluna Lavanderia (dados) -->
                                       <td v-if="servicosOfertados.some(s => s.oferece_lavanderia === 'SIM')" class="text-center">
                                       <div class="form-check form-switch d-inline-block">
                                          <input
                                             type="checkbox"
                                             class="form-check-input"
                                             role="switch"
                                             :data-key="`${servico.data}_lavanderia`"
                                             :checked="servico.lavanderia === 'SIM'"
                                             :disabled="servico.lavanderia_disabled || savingServicoDaInscricao[`${servico.data}_lavanderia`] "
                                             @change="toggleServico(servico.data, 'lavanderia', $event.target.checked)"
                                          />
                                          <span class="ms-1 small">{{ servico.lavanderia === 'SIM' ? 'SIM' : 'NÃO' }}</span>
                                       </div>
                                       </td>

                                       <!-- Coluna Traslado (dados) -->
                                       <td v-if="servicosOfertados.some(s => s.oferece_traslado === 'SIM')" class="text-center">
                                       <div class="form-check form-switch d-inline-block">
                                          <input
                                             type="checkbox"
                                             class="form-check-input"
                                             role="switch"
                                             :data-key="`${servico.data}_traslado`"
                                             :checked="servico.traslado === 'SIM'"
                                             :disabled="servico.traslado_disabled || savingServicoDaInscricao[`${servico.data}_traslado`] "
                                             @change="toggleServico(servico.data, 'traslado', $event.target.checked)"
                                          />
                                          <span class="ms-1 small">{{ servico.traslado === 'SIM' ? 'SIM' : 'NÃO' }}</span>
                                       </div>
                                       </td>

                                       <!-- Coluna Café (dados) -->
                                       <td v-if="servicosOfertados.some(s => s.oferece_cafe === 'SIM')" class="text-center">
                                       <div class="form-check form-switch d-inline-block">
                                          <input
                                             type="checkbox"
                                             class="form-check-input"
                                             role="switch"
                                             :data-key="`${servico.data}_cafe`"
                                             :checked="servico.cafe === 'SIM'"
                                             :disabled="servico.cafe_disabled || savingServicoDaInscricao[`${servico.data}_cafe`] "
                                             @change="toggleServico(servico.data, 'cafe', $event.target.checked)"
                                          />
                                          <span class="ms-1 small">{{ servico.cafe === 'SIM' ? 'SIM' : 'NÃO' }}</span>
                                       </div>
                                       </td>

                                       <!-- Coluna Almoço (dados) -->
                                       <td v-if="servicosOfertados.some(s => s.oferece_almoco === 'SIM')" class="text-center">
                                       <div class="form-check form-switch d-inline-block">
                                          <input
                                             type="checkbox"
                                             class="form-check-input"
                                             role="switch"
                                             :data-key="`${servico.data}_almoco`"
                                             :checked="servico.almoco === 'SIM'"
                                             :disabled="servico.almoco_disabled || savingServicoDaInscricao[`${servico.data}_almoco`] "
                                             @change="toggleServico(servico.data, 'almoco', $event.target.checked)"
                                          />
                                          <span class="ms-1 small">{{ servico.almoco === 'SIM' ? 'SIM' : 'NÃO' }}</span>
                                       </div>
                                       </td>

                                       <!-- Coluna Jantar (dados) -->
                                       <td v-if="servicosOfertados.some(s => s.oferece_jantar === 'SIM')" class="text-center">
                                       <div class="form-check form-switch d-inline-block">
                                          <input
                                             type="checkbox"
                                             class="form-check-input"
                                             role="switch"
                                             :data-key="`${servico.data}_jantar`"
                                             :checked="servico.jantar === 'SIM'"
                                             :disabled="servico.jantar_disabled || savingServicoDaInscricao[`${servico.data}_jantar`] "
                                             @change="toggleServico(servico.data, 'jantar', $event.target.checked)"
                                          />
                                          <span class="ms-1 small">{{ servico.jantar === 'SIM' ? 'SIM' : 'NÃO' }}</span>
                                       </div>
                                       </td>                                       

                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                        </div>

                        <div v-else class="alert alert-secondary">
                           <i class="fas fa-info-circle me-2"></i>
                           Nenhum serviço configurado para os dias deste evento.
                        </div>
                     </CAccordionBody>
                  </CAccordionItem>
               </CAccordion>
            </CCardBody>
         </CCard>
      </template>
   </GenericCrud>
</template>

<script setup>
import { ref, toRaw, computed, reactive, nextTick, watch, onMounted } from 'vue';
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

const currentInscricaoId = ref(null)
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { useServicosInscricao } from '@/composables/useServicosInscricao';

const {
   servicosOfertados, // ← ref()
   servicosDaInscricao,
   loading: loadingServicos,
   fetchServicosOfertados,
   fetchServicosDaInscricao,
} = useServicosInscricao();

const onAfterLoad = async (formData) => {
   // Opção 1 - toRaw (importe do vue)
   // console.log('📢 afterLoad disparado!. Dados do registro aberto:', toRaw(formData))

   const eventoId = currentEvent.value?.id  // Pega direto do Pinia
   const inscricaoId = formData.id
   currentInscricaoId.value = formData.id  // ← guarda aqui
  
   if (eventoId) {
      await fetchServicosOfertados(eventoId)
   }
  
   if (inscricaoId) {
      await fetchServicosDaInscricao(inscricaoId)
      console.log('🔍 servicosDaInscricao COMPLETO:', JSON.parse(JSON.stringify(servicosDaInscricao.value)))
   }

   // Combina os dados e monta a tabela
   combinarServicos()
}

// servicosPorDia é derivado dos dados
const servicosPorDia = ref([]);

const combinarServicos = () => {
  const dias = []
  
  // 1. Base: serviços oferecidos pelo evento
  servicosOfertados.value.forEach(servico => {
    // Extrai apenas a data (YYYY-MM-DD) sem timezone
    const dataServico = servico.data_servico.split('T')[0]
    
    dias.push({
      data: dataServico,
      id: null,
      transporte: 'NÃO',
      hospedagem: 'NÃO',
      lavanderia: 'NÃO',
      traslado: 'NÃO',
      cafe: 'NÃO',
      almoco: 'NÃO',
      jantar: 'NÃO',
      transporte_disabled: servico.oferece_transporte !== 'SIM',
      hospedagem_disabled: servico.oferece_hospedagem !== 'SIM',
      lavanderia_disabled: servico.oferece_lavanderia !== 'SIM',
      traslado_disabled: servico.oferece_traslado !== 'SIM',
      cafe_disabled: servico.oferece_cafe !== 'SIM',
      almoco_disabled: servico.oferece_almoco !== 'SIM',
      jantar_disabled: servico.oferece_jantar !== 'SIM'
    })
  })
  
  // 2. Sobrescrever com valores já salvos da inscrição
  servicosDaInscricao.value.forEach(saved => {
    // Extrai apenas a data (YYYY-MM-DD) sem timezone
    const dataServico = saved.data_servico.split('T')[0]
    const dia = dias.find(d => d.data === dataServico)

    if (dia) {
      dia.id = saved.id
      dia.transporte = saved.transporte || 'NÃO'
      dia.hospedagem = saved.hospedagem || 'NÃO'
      dia.lavanderia = saved.lavanderia || 'NÃO'
      dia.traslado = saved.traslado || 'NÃO'
      dia.cafe = saved.cafe || 'NÃO'
      dia.almoco = saved.almoco || 'NÃO'
      dia.jantar = saved.jantar || 'NÃO'
    }
  })
  
  // 3. Ordenar por data
  servicosPorDia.value = dias.sort((a, b) => new Date(a.data) - new Date(b.data))
  console.log('📊 Tabela montada:', servicosPorDia.value)
}


const servicosOrdenados = computed(() => servicosPorDia.value)

const savingServicoDaInscricao = ref({})

const toggleServico = async (data, servico, checked) => {
  const valor = checked ? 'SIM' : 'NÃO'
  const dia = servicosPorDia.value.find(d => d.data === data)
  const valorOriginal = dia[servico]

  // Verificação de inscrição salva
  if (!currentInscricaoId.value) {
    showToast({
      title: 'Atenção',
      message: 'Salve a inscrição primeiro antes de marcar serviços. Depois Edite a marque os Serviços',
      variant: 'warning'
    })

    // Forçar o switch a voltar visualmente
    await nextTick()
    const input = document.querySelector(`input[data-key="${data}_${servico}"]`)
    if (input) {
      input.checked = dia[servico] === 'SIM'
    }

    return
  }
  
  const key = `${data}_${servico}`
  savingServicoDaInscricao.value[key] = true 
  dia[servico] = valor
  
  try {
    let response

    // Se tem ID, atualiza registro existente - PATCH
    if (dia.id) {
      response = await api.patch(`/inscricao-servicos-linha/${dia.id}`, {
        servico: servico,
        valor: valor
      })
    } else {
      // Cria novo registro - POST
      response = await api.post(`/inscricao-servicos-linha`, {
        inscricao_id: currentInscricaoId.value,
        data_servico: data,
        servico: servico,
        valor: valor
      })
      
      // Atualiza o ID do dia com o retorno do backend
      if (response.data.id) {
        dia.id = response.data.id
      }
    }
    
    // Verificar se o backend excluiu o registro (todos NÃO)
    if (response.data.deleted) {
      // Recarregar a tabela para remover a linha
      await fetchServicosDaInscricao(currentInscricaoId.value)
      combinarServicos()
    }
    
    showToast({
      title: 'Sucesso',
      message: `${servico} atualizado para ${valor}`,
      variant: 'success'
    })
    
  } catch (error) {
    dia[servico] = valorOriginal
    
    showToast({
      title: 'Erro',
      message: error.response?.data?.error || 'Erro ao atualizar serviço',
      variant: 'danger'
    })
  } finally {
    savingServicoDaInscricao.value[key] = false
  }
}

// +++ Relatório +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * BASE Crud - Page Buttons são o Botões Extras no canto superior direito
 */
// const pageExtraButtons = [{}]; // sem extra buttons
const pageExtraButtons = computed(() => [
   {
      label: '<i class="fa fa-print"></i> Inscrições PDF',
      action: 'printRelInscricoes',
      class: 'btn btn-sm btn-outline-info me-1',
   },
]);

/**
 * CAPTURA as ações click dos pega Buttons e chama as funções necessárias
 */
const onpageExtraButtonsActions = async ({ label, action }) => {
   // console.log('onpageExtraButtonsActions: ', label, action);

   // Vamos chamar a função necessária para este evento
   if (action === 'printRelInscricoes') {
      printRelInscricoes();
   }
};

async function printRelInscricoes() {
   const response = await api.get(
      `/inscricao/relinscricoes/${currentEvent.value?.id}`,
      {
         params: { orderby: 'chegada' },
         responseType: 'blob',
      }
   );

   const blob = new Blob([response.data], { type: 'application/pdf' });
   const url = window.URL.createObjectURL(blob);
   window.open(url, '_blank');
   window.URL.revokeObjectURL(url); // Liberar URL da memória

   showToast({
      title: 'Sucesso',
      message: `Relatório gerado com sucesso.`,
   });
}



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const formatarData = (data) => {
  if (!data) return ''
  // Apenas reorganiza a string YYYY-MM-DD para DD/MM/YYYY
  const partes = data.split('-')
  if (partes.length !== 3) return data
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

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
