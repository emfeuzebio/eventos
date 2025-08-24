<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      ref="crudRef"
      modalSize="xxl"
      modalFullscreen="fullscreen"
      title="Gestão de Partidas "
      description="<br/>Gestão dos Traslados de Partidas das Pessoas inscritas em Evento <br/> Ordenado pela Data-Hora de Partida"
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
      </template>
   </GenericCrud>

   <!-- Editar Viagem Chegada Modal | Extra Modal Especializado -->
   <CModal
      :visible="viagemPartidadaShowModal"
      @close="viagemPartidadaShowModal = false"
   >
      <CModalHeader>
         <strong>Editar Viagem de Partida</strong>
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
            >Dados da Viagem de Traslado de Partida marcada</label
         >
         <!-- <CAlert color="dark" v-html="viagemPartidaInscricao"></CAlert> -->
         <CAlert color="dark" v-html="viagemPartidadaEscolhida"></CAlert>
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="viagemPartidadaShowModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <CButton
            color="btn btn-primary btn-sm me-1"
            @click="salvarViagemPartida(viagemSelecionada)"
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
      title: 'DH Partida',
      data: 'partida_data_hora',
      render: (data, type) => {
         if (type === 'sort' && data) {
            // converte '2025-08-19 14:30:00' para '2025-08-19T14:30:00'
            return data.replace(' ', 'T');
         }
         return data || '';
      },
   },
   {
      title: 'Pessoa e Dados da Partida',
      className: 'text-left',
      width: 'auto',
      data: null, // importante usar null quando o render vai acessar múltiplos campos
      render: function (data, type, row) {
         const nome = row.pessoa?.nome_social || '';
         const papel = row.funcao?.descricao || '';
         const modalidade = row.modalidade || 'Não informada';
         const entidade_sigla = row.pessoa?.entidade?.sigla ?? 'Sem Entidade';

         const partida_meio_transp =
            row.partida_meio_transp || 'Meio Não definido';
         const partida_cia_transp = row.partida_cia_transp || '';
         const partida_data_hora = formatToBrDateTime(
            row.partida_data_hora || 'Data-Hora Não definida'
         );
         const partida_veiculo =
            row.viagem_partida?.veiculo.descricao ||
            (row.partida_traslado == 'SIM' ? 'Veículo Não definido' : '');

         return `<span class="fw-bold">${nome}</span> <small class="text-muted">${papel} > ${entidade_sigla} </small> <br/>
                     <span class="fw-bold">Modalidade</span>
                     <small class="text-muted">${modalidade}</small> <br/>
                     <span class="fw-bold">Partida</span>
                     <small class="text-muted">${partida_data_hora}</small> >
                     <small class="text-muted">${partida_meio_transp}</small>
                     <small class="text-muted">${partida_cia_transp}</small> <br/>
                     <span class="fw-bold">Traslado</span> ${row.partida_traslado}
                     <small class="text-muted">${partida_veiculo}</small> <br/>
                     <span class="fw-bold">Hospedagem</span> <small class="text-muted">${row.custeio_hospedagem}</small>
               `;
      },
   },
   {
      title: 'Traslado de Partida',
      data: null,
      width: 'auto',
      className: 'text-center',
      render: function (data, type, row) {
         let text = '';
         if (row.viagem_partida) {
            text += `${
               row.viagem_partida?.rota.nome || 'Rota Não definida'
            } <br/>`;
            text += `${formatToBrDateTime(
               row.viagem_partida?.data_hora || 'Data/Hora Não definida'
            )} <br/>`;
            text += `<b>${
               row.viagem_partida?.veiculo.descricao || 'Veículo Não definido'
            } </b><br/>`;
         }

         return text;
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
 * BASE Crud - Page Buttons são o Botões Extras no canto superior direito
 */
// const pageExtraButtons = [{}]; // sem extra buttons
const pageExtraButtons = computed(() => [
   {
      label: '<i class="fa fa-print"></i> Traslados PDF',
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
   const response = await api.get(
      `/inscricao/reltraslados/${globalEventoId.value}`,
      {
         params: { orderby: 'partida' },
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

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso - recupera as abilities do usuário logado na ação
   const canMarcarcheg = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';

   // trasposição do checkbox para os dados da linha
   const isChecked = row.traslado_partida_executou === 'SIM' ? 'checked' : '';

   return `
      <div class="text-center">
         <button class="btn btn-xs btn-outline-info" ${canMarcarcheg} data-custom-action="marcarViagemPartida" data-viagem-id="${row.traslado_partida_viagem_id}" data-inscricao-id="${row.id}"><i class="fa fa-edit"></i> Marcar Viagem</button>

         <button class="btn btn-xs btn-outline-success" ${canMarcarcheg} data-custom-action="notificarPessoa" data-viagem-id="${row.traslado_partida_viagem_id}" data-inscricao-id="${row.id}"><i class="fa fa-plane"></i> Notificar Pessoa</button>

         <button class="btn btn-xs btn-outline-success" ${canMarcarcheg} data-custom-action="notificarMotorista" data-viagem-id="${row.traslado_partida_viagem_id}" data-inscricao-id="${row.id}"><i class="fa fa-plane"></i> Notificar Motorista</button>
         
         <div class="form-check form-switch d-inline-block">
            <label style="font-size: 12px; font-weight: bold;">Partiu?</label>
            <input class="form-check-input" ${canMarcarcheg} data-custom-action="trasladou" type="checkbox" data-viagem-id="${row.traslado_partida_viagem_id}"data-inscricao-id="${row.id}" ${isChecked} >
         </div>
      </div>
   `;
};

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const viagemPartidadaShowModal = ref(false);
const viagemPartidaFormDados = ref({});
const viagemChegadaFormErros = ref({});
const viagemPartidadaEscolhida = ref('');
const viagemPartidaInscricao = ref('');
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
   fetchEventos,
   marcarTrasladoPartida,
   fetchRotas,
   fetchViagensDaRota,
   rotas,
} = useEventos();
fetchEventos();
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
const order = [1, 'asc']; // partida_data_hora: nessse caso ordena pela segunda coluna [0,1,3,...] mesmo que ela esteja visible = false

//  const filters = [{}]; // nessse caso sem filtros
const filters = computed(() => [
   {
      label: 'Traslado',
      field: 'partida_traslado',
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
      field: 'partida_meio_transp',
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
            message: `Impossível Marcar o Traslado de Partida! Não existe uma Viagem marcada.`,
            color: 'danger',
         });
         return;
      }

      const sucesso = await marcarTrasladoPartida(inscricaoId, {
         traslado_partida_executou: isChecked,
      });

      if (sucesso) {
         showToast({
            title: 'Sucesso',
            message: `Marcado Traslado Partida ${isChecked} na Inscrição ${inscricaoId} com sucesso!`,
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
            message: `Notificou o Motorista da Viagem ${viagemId} de Traslado Partida da Inscrição ${inscricaoId} com sucesso!`,
         });
      } catch (error) {
         if (error.response?.status === 422) {
            regiaoFormErros.value = error.response.data.errors || {};
         }
      }
   }

   if (action == 'marcarViagemPartida') {
      // console.log('marcarViagemPartida: ', row, action, dataset, target);
      // console.log('marcarViagemPartida: ', row.pessoa.nome_completo);
      // criar as refs(), ex: viagemPartidaFormDados.value (ver acima)
      // carregar os dados: pode usar o mesmos da row DataTables recebidos ou carregar via get

      inscricaoDados.value = `<b>${
         row?.pessoa.nome_completo || 'Sem Nome'
      }</b> <br/>${row.funcao?.sigla || 'Papel não definido'} - ${
         row.pessoa.entidade?.sigla || 'Entidade Não definida'
      }`;

      viagemPartidaInscricao.value =
         inscricaoDados.value +
         `<br/><b>PARTIDA</b>: ${formatToBrDateTime(
            row?.partida_data_hora || ''
         )} ${row?.partida_meio_transp || ''} ${row?.partida_cia_transp || ''}`;

      viagemPartidadaEscolhida.value = 'A viagem não está marcada';
      if (dataset.viagemId) {
         const viagem = await api.get(
            `/inscricao/viagemmarcada/${dataset.viagemId}`
         );

         viagemPartidadaEscolhida.value = `
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

      viagemPartidaFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      editarViagemPartida();
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

const editarViagemPartida = async () => {
   // Aqui você pode implementar a lógica para editar
   // ou já usamos os dados do formulário preenchidos
   // console.log('Editar:', viagemPartidaFormDados.value);
   // ou aqui poderia chamar uma API para buscar os dados da região pelo ID
   fetchRotas(currentEvent.value?.id ?? '', 'Partida');
   rotaSelecionada.value = false;
   viagemSelecionada.value = false;
   viagemPartidadaShowModal.value = true;
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarViagemPartida = async (viagemId) => {
   const inscricaoId = viagemPartidaFormDados.value?.id;
   // console.log('Salvar salvarViagemPartida:', inscricaoId,viagemId );

   if (!inscricaoId || !viagemId) {
      showToast({
         title: 'Alerta',
         message: `O código da Inscrição ${inscricaoId} e o da Viagem ${viagemId} são obrigatórios!`,
         color: 'danger',
      });
      return;
   }

   try {
      const res = await api.put(`/inscricao/alternarpartida/${inscricaoId}`, {
         viagem_id: viagemId,
      });

      if (viagemId == 'remove') {
         showToast({
            title: 'Alerta',
            message: res.data.message,
            // message: `Removeu a Viagem ID ${inscricaoId} do Traslado de Partida com sucesso!`,
         });
         viagemPartidadaEscolhida.value = `Viagem de Traslado de Partida não selecionada.`;
      } else {
         showToast({
            title: 'Alerta',
            message: res.data.message,
            // message: `Inseriu a Viagem ID ${inscricaoId} do Traslado de Partida com sucesso!`,
         });

         const viagem = await api.get(`/inscricao/viagemmarcada/${viagemId}`);
         // console.log('Resposta do servidor:', viagem.data.message);

         viagemPartidadaEscolhida.value = `
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
