<script setup>
import { ref, toRaw, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import { formatToBrDateTime } from '@/utils/dateFormat';
import 'datatables.net-dt';
import api from '@/services/api';

// define a Entidade Principal da View
const entity = 'inscricao';
// const entity = 'inscricao';

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
   // { title: 'Evento', data: 'evento.sigla', width: '100px' },
   {
      title: 'Chegada',
      data: null,
      render: function (data, type, row) {
         const meio = row.chegada_meio_transp || 'Meio';
         const cia = row.chegada_cia_transp || 'Cia';
         const dh = row.chegada_data_hora
            ? formatToBrDateTime(row.chegada_data_hora)
            : 'Data/Hora';
         return `<span class="">${dh}</span> <br/> <small class="text-muted">${meio} - ${cia}</small>`;
      },
      className: 'text-left',
      width: '180px',
   },
   {
      title: 'Pessoa | Entidade | Papel | Modalidade',
      data: null, // importante usar null quando o render vai acessar múltiplos campos
      render: function (data, type, row) {
         const nome = row.pessoa?.nome_social || '';
         const papel = row.funcao?.descricao || '';
         const modalidade = row.modalidade || 'Não informada';
         const entidade_sigla = row.pessoa?.entidade?.sigla ?? 'Sem Entidade';
         return `<span class="fw-bold">${nome}</span> <small class="text-muted">${entidade_sigla}</small> <br/> <small class="text-muted">${papel} - ${modalidade}</small>`;
      },
      className: 'text-left',
      width: '320px',
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
   {
      title: 'Hospedagem',
      data: null,
      width: '160px',
      render: function (data, type, row) {
         return '';
      },
   },
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
      <button class="btn btn-xs btn-outline-info" ${canMarcarcheg} data-custom-action="marcarViagem" data-viagem-id="${row.traslado_chegada_viagem_id}" data-inscricao-id="${row.id}">Marcar Viagem</button>

      <button class="btn btn-xs btn-outline-success" ${canMarcarcheg} data-custom-action="notificarPessoa" data-viagem-id="${row.traslado_chegada_viagem_id}" data-inscricao-id="${row.id}">Msg Pessoa</button>

      <button class="btn btn-xs btn-outline-warning" ${canMarcarcheg} data-custom-action="notificarMotorista" data-viagem-id="${row.traslado_chegada_viagem_id}" data-inscricao-id="${row.id}">Msg Motorista</button>

      <div class="form-check form-switch">
         <input class="form-check-input" ${canMarcarcheg} data-custom-action="trasladou" type="checkbox" data-inscricao-id="${row.id}" ${isChecked} >
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
//  const filters = [{}]; // nessse caso sem filtros

const filters = computed(() => [
   {
      label: 'Evento',
      field: 'evento_id',
      type: 'select',
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

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   console.log(
      // 'onExtraAction ID:',
      // id,
      // 'row:',
      // row,
      'action:',
      action,
      'dataset:',
      dataset,
      'target:',
      target
   );

   if (action == 'trasladou') {
      const inscricaoId = row.id;
      // const isChecked = target.checked ? 'SIM' : 'NÃO';
      const isChecked = target[0].checked ? 'SIM' : 'NÃO';
      // const isChecked = (e.currentTarget as HTMLInputElement).checked ? 'SIM' : 'NÃO';
      // console.log('trasladou viagem', inscricaoId, isChecked);

      // const isChecked = 'SIM';

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
      console.log('notificarMotorista', inscricaoId);

      const sucesso = true;
      // const sucesso = await marcarTrasladoChegada(inscricaoId, {
      //    traslado_chegada_executou: isChecked,
      // });

      if (sucesso) {
         showToast({
            title: 'Sucesso',
            message: `Notificou o Motorista da Viagem ${viagemId} de Traslado Chegada da Inscrição ${inscricaoId} com sucesso!`,
         });
      }
      // chamarRefresh(); // chama refreshTable() do composable via expose
      // console.log('trasladou viagem', inscricaoId, isChecked);
      // mas poderiamos também apenas passar o id da região para a função editarRegiao(id) e carregar os dados da API novamente com os dados atualizados
   }

   if (action == 'marcarViagem') {
      // console.log('marcarViagem: ', row, action, dataset, target);
      console.log('marcarViagem: ', row.pessoa.nome_completo);
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

const fetchViagensPorRota = async (rotaId) => {
   try {
      viagensDaRota.value = []; // limpa anterior
      const res = await api.get(`/viagem`, { params: { rota_id: rotaId } });
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
   fetchRotas();
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

<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      ref="crudRef"
      modalSize="xxl"
      modalFullscreen="fullscreen"
      title="Gestão de Chegadas "
      description="Gestão dos Traslados de Chegadas de Pessoas inscritas em Evento"
      endpoint="inscricao"
      columnActionsWidth="200px"
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
            @change="fetchViagensPorRota(rotaSelecionada)"
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
            >Dados da Viagem de Traslado de Chegada escolhida</label
         >
         <!-- <CAlert color="dark" v-html="viagemChegadaInscricao"></CAlert> -->
         <CAlert color="dark" v-html="viagemChegadaEscolhida"></CAlert>

         <!-- <label class="form-label fw-bold mb-1 mt-0">Nome da Região</label> -->
         <!-- <div class="form-text">
            {{ viagemChegadaFormDados.regiao.descricao }}
         </div> -->

         <!-- <CFormInput
            v-model="viagemChegadaFormDados.regiao.descricao"
            :class="{ 'is-invalid': viagemChegadaFormErros.descricao }"
         /> -->

         <!-- <CFormInput
            v-model="viagemChegadaFormDados.regiao.sigla"
            :class="{ 'is-invalid': viagemChegadaFormErros.sigla }"
         /> -->
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="viagemChegadaShowModal = false"
            >Fechar</CButton
         >
         <CButton
            color="btn btn-primary btn-sm me-1"
            @click="salvarViagemChegada(viagemSelecionada)"
            >Salvar</CButton
         >
      </CModalFooter>
   </CModal>
</template>
