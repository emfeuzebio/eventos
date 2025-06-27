<!-- views/GenericCrudView.vue -->
<template>
   <CButton
      class="btn btn-sm btn-outline-warning me-1 mb-2"
      @click="atualizarTabela"
      >Recarregar
   </CButton>

   <CButton class="btn btn-sm btn-outline-info me-1 mb-2" @click="btnImprimir"
      >Imprimir
   </CButton>

   <CButton
      class="btn btn-sm btn-outline-success me-1 mb-2"
      @click="btnFormModal(1)"
      >Form Modal
   </CButton>

   <BaseCrudTable
      ref="crudTableRef"
      title="Cadastro de Estados "
      description="Gerenciamento do cadastro de Estados da Federação"
      endpoint="inscricao"
      :abilities="abilities"
      :columns="columns"
      :filters="filters"
      :extra-column-render="extraColumnRender"
      @edit="onEdit"
      @delete="onDelete"
      @custom="onCustomAction"
   />

   <!-- Viagem Selecionar Modal -->
   <CModal
      :visible="showZapModal"
      @close="showZapModal = false"
      backdrop="static"
   >
      <CModalHeader>
         <strong>Marcar Viagem </strong>
      </CModalHeader>
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Dados da Chegada</label>
         <CAlert color="primary" v-html="zapMensagem"></CAlert>

         <label class="form-label fw-bold mb-1 mt-0">Selecione a Rota</label>
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

         <label class="form-label fw-bold mb-1 mt-2">Selecione a Viagem</label>
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
         <CAlert color="dark" v-html="zapViagemEscolhida"></CAlert>
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="showZapModal = false"
            >Fechar</CButton
         >
         <CButton
            color="btn btn-primary btn-sm me-1"
            @click="salvarViagemModal(viagemSelecionada)"
            >Salvar</CButton
         >
      </CModalFooter>
   </CModal>

   <!-- Editar Modal -->
   <CModal
      :visible="showEditModal"
      @close="showEditModal = false"
      backdrop="static"
      keyboard="true"
   >
      <CModalHeader>
         <strong>Editar Registro</strong>
      </CModalHeader>
      <CModalBody>
         <CFormInput
            v-model="formData.nome_completo"
            label="Nome da Pessoa"
            class="form-control"
            :class="{ 'is-invalid': formError.nome_completo }"
            placeholder="João José Maria"
         />
         <div class="form-error" v-if="formError.nome_completo">
            {{ formError.nome_completo[0] }}
         </div>

         <CFormSelect
            v-model="formData.modalidade"
            label="Modalidade"
            class="form-control"
            :options="[
               { value: '', label: 'Selecione' },
               { value: 'Presencial', label: 'Presencial' },
               { value: 'Virtual', label: 'Virtual' },
            ]"
         />
         <div class="form-error" v-if="formError.modalidade">
            {{ formError.modalidade[0] }}
         </div>

         <CFormSelect
            v-model="formData.chegada_meio_transp"
            label="Chegada Meio de Transporte"
            class="form-control"
            :options="[
               { value: '', label: 'Selecione' },
               { value: 'Aéreo', label: 'Aéreo' },
               { value: 'Rodoviário', label: 'Rodoviário' },
               { value: 'Rodo Particular', label: 'Rodo Particular' },
               { value: 'Não Informado', label: 'Não Informado' },
            ]"
         />
         <div class="form-error" v-if="formError.chegada_meio_transp">
            {{ formError.chegada_meio_transp[0] }}
         </div>

         <CFormInput
            v-model="formData.chegada_cia_transp"
            label="Chegada Cia + Nº Voo/Ônibus"
            class="form-control"
            :class="{ 'is-invalid': formError.chegada_cia_transp }"
            placeholder="LATAM, GOL, AZUL, etc."
         />
         <div class="form-error" v-if="formError.chegada_cia_transp">
            {{ formError.chegada_cia_transp[0] }}
         </div>

         <pre>{{ formData.value }}</pre>
         <pre>{{ JSON.stringify(formData.value) }}</pre>
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-sm btn-secondary me-1"
            @click="showEditModal = false"
            >Cancelar</CButton
         >
         <CButton color="btn btn-sm btn-primary   me-1" @click="saveEditModal"
            >Salvar</CButton
         >
      </CModalFooter>
   </CModal>

   <FormModal
      :visible="formModalVisivel"
      :title="'Editar'"
      :conteudo="'Conteúdo do Formulário'"
      :formData="formDataModal"
      @close="formModalVisivel = false"
      @save="salvarDados"
      @destroy="destroyDados"
   />
</template>

<script setup>
import BaseCrudTable from '@/components/BaseCrudTable.vue';
import api from '@/services/api';
import { formatToBrDateTime } from '@/utils/dateFormat';
import { useToast } from '@/composables/useToast';
import { getAbilities } from '@/services/AuthorizationsService';
import { useEventos } from '@/composables/useEventos';
import { ref } from 'vue';
import { computed } from 'vue';
import { nextTick } from 'vue';
import FormModal from '@/components/FormModal.vue';

import {
   CModal,
   CModalHeader,
   CModalBody,
   CModalFooter,
   CButton,
} from '@coreui/vue';

/**
 * Constantes e Variáveis Reativas BASE do CRUD DataTable
 */
const crudTableRef = ref(); // ref para o componente BaseCrudTable

const formData = ref({}); // campos do Form Edit Dados
const formError = ref({}); // erros  do Form Edit Dados

const { showToast } = useToast(); // Toasts de Alerta

const showDeleteModal = ref(false); // Delete Modal
const showEditModal = ref(false); // Edit Modal

const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado
// console.log('Abilities carregadas:', JSON.parse(JSON.stringify(abilities)));

/**
 * Constantes e Variáveis Reativas ESPECIALIZADAS do CRUD DataTable
 */

const viagensDaRota = ref([]);
const viagemSelecionada = ref(false);
const rotaSelecionada = ref(false);

const {
   marcarTrasladoChegada,
   fetchRotas,
   rotas,
   fetchInscricoes,
   inscricoes,
   getInscricao,
   inscricao,
} = useEventos();

// Modal Zap
const showZapModal = ref(false);
const zapMensagem = ref('');
const zapViagemEscolhida = ref('');
const zapRow = ref(null);

/**
 * Filtros ESPECIALIZADAS do CRUD DataTable
 */
const filters = [{}]; // sem filtros

/*
const filters = [
   {
      label: 'Estado',
      field: 'estado_id',
      type: 'select',
      options: estados.value.map((estado) => ({
         value: estado.id,
         label: estado.descricao,
      })),
   },
];

Filtros da Página com valores fixos - filtro reativo aos dados carregados
const filters = computed(() => [
   {
      label: 'Estado',
      field: 'estado_id',
      type: 'select',
      // options: estados.value.map((estado) => ({
      //    value: estado.id,
      //    label: estado.descricao,
      // })),
   },
]);

*/

/**
 * Colunas BASE do CRUD DataTable
 */
const columns = [
   { title: 'ID', data: 'id', width: '30px' },
   {
      title: 'Evento',
      data: 'evento.sigla',
      render: (data) => `${data} `,
      className: 'text-left',
      width: '90px',
   },
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
      title: 'Pessoa',
      data: null, // importante usar null quando o render vai acessar múltiplos campos
      width: '300px',
      className: 'text-left',
      render: function (data, type, row) {
         const nome = row.pessoa?.nome_social || 'Sem Nome';
         const entidade = row.pessoa.entidade?.sigla || 'Sem Entidade';
         const papel = row.funcao?.descricao || 'Sem Papel';
         const modalidade = row.modalidade || 'Sem Modalidade';
         return `<span class="fw-bold">${nome}</span> <br/> <small class="text-muted">${entidade}</small> <br/> <small class="text-muted">${papel} - ${modalidade}</small>`;
      },
   },
   {
      title: 'Tranlado Chegada',
      data: null,
      class: 'dt-center small',
      className: 'text-center',
      width: '100px',
      render: function (data, type, row) {
         return `<span class=""> x </span>`;
      },
   },
];

/**
 * coluna ESPECIALIZADAS do CRUD DataTable
 */
const extraColumnRender = (row) => {
   // controle de acesso
   const canMarcarcheg = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';
   const canEnviarZapp = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';
   const canSelecionar = abilities.includes('inscricao.selecionar')
      ? ''
      : 'disabled';

   // trasposição para checkbox
   const isChecked = row.chegada_traslado === 'SIM' ? 'checked' : '';

   return `
    <button class="btn btn-xs btn-outline-info" ${canEnviarZapp} data-custom-action="zap" data-viagem-id="${row.traslado_chegada_viagem_id}">Marcar Viagem</button>

    <div class="form-check form-switch">
      <input class="form-check-input" ${canMarcarcheg} data-custom-action="trasladou" type="checkbox" data-viagem-id="x" data-pessoa-id="${row.pessoa_id}" data-rota-id="x" ${isChecked} >
    </div>
  `;
};

//     <button class="btn btn-xs btn-success" ${canSelecionar} data-custom-action="selecionar">Selecionar</button>

/**
 * Funções ESPECIALIZADAS do CRUD DataTable
 */
const onCustomAction = async ({ row, action, dataset, target }) => {
   // console.log('dataset:', dataset);
   console.log(`Custon Action [${action}] dataset:`, dataset);
   console.log(`Custon Action [${action}] Dados da Linha:`, row);

   if (action === 'zap') {
      const inscricaoId = row.id;
      zapViagemEscolhida.value = `Viagem de Traslado de Chegada não selecionada.`;
      fetchRotas(); // carrega lista de Rotas no <select>
      zapRow.value = row;

      zapMensagem.value = `<b>${row.pessoa.nome_completo}</b> ( ${
         row.funcao.sigla
      } - ${
         row.pessoa.entidade.sigla
      })<br/><b>CHEGADA</b>: ${formatToBrDateTime(row.chegada_data_hora)} ${
         row.chegada_meio_transp
      } ${row.chegada_cia_transp}`;

      // const viagemId = dataset.viagemId || row.traslado_chegada_viagem_id;
      // const viagemId = dataset.viagemId ?? '0';
      // const viagemId = dataset.viagemId != 'null' ? dataset.viagemId : '0';

      if (dataset.viagemId != 'null') {
         const viagem = await api.get(
            `/inscricao/viagemmarcada/${dataset.viagemId}`
         );

         zapViagemEscolhida.value = `
               <b>Evento</b>: ${
                  viagem.data.evento_nome || 'Não Informado'
               } <br/>
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

      // zapViagemEscolhida.value = `<b>Atualizar aqui</b>`;
      viagemSelecionada.value = ''; // limpa a seleção anterior
      rotaSelecionada.value = ''; // limpa a seleção anterior
      showZapModal.value = true;
   } else if (action === 'trasladou') {
      const inscricaoId = row.id;
      const isChecked = target.checked ? 'SIM' : 'NÃO';
      // console.log('trasladou viagem', inscricaoId, isChecked);

      const sucesso = await marcarTrasladoChegada(inscricaoId, {
         traslado_chegada_executou: isChecked,
      });

      if (sucesso) {
         showToast({
            title: 'Sucesso',
            message: `Marcado Traslado Chegada ${isChecked} com sucesso!`,
         });
      }
   } else if (action === 'selecionar') {
      console.log('Selecionar viagem', row);
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

const salvarViagemModal = async (viagemId) => {
   const inscricaoId = zapRow.value?.id;

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
      // console.log('Resposta do servidor:', res.data.message);

      if (viagemId == 'remove') {
         showToast({
            title: 'Alerta',
            message: res.data.message,
            // message: `Removeu a Viagem ID ${inscricaoId} do Traslado de Chegada com sucesso!`,
         });
         zapViagemEscolhida.value = `Viagem de Traslado de Chegada não selecionada.`;
      } else {
         showToast({
            title: 'Alerta',
            message: res.data.message,
            // message: `Inseriu a Viagem ID ${inscricaoId} do Traslado de Chegada com sucesso!`,
         });

         const viagem = await api.get(`/inscricao/viagemmarcada/${viagemId}`);
         // console.log('Resposta do servidor:', viagem.data.message);

         zapViagemEscolhida.value = `
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
      atualizarTabela();

      // showToast({title: 'Alerta', message: `Registrada a Viagem ID ${id} para o Traslado de Chegada com sucesso!`});
      // itemToDelete.value = null;
      // showConfirmDelete.value = false;
      // zapViagemEscolhida
      // refreshViagemEscolhida();
      // refreshTable();
      // zapViagemEscolhida.value = `<b>Atualizar aqui</b>`;
      // zapViagemEscolhida.value = 'xxx';
      // nextTick(() => {
      //    zapViagemEscolhida.value = 'xxx';
      // });
   } catch (error) {
      // console.error('Erro ao Setar a Viagem:', error);
      // showToast({title: 'Erro', message: `Erro ao excluir o Registro ${id}! ` + error, color: 'danger',});
   }
};

/**
 * Funções do BASE CRUD Table
 */
function btnImprimir() {
   crudTableRef.value?.btnImprimir();
}

// FORM MODAL
const formModalVisivel = ref(false);
const formDataModal = ref({});

/**
 * FUNCIONA
 * MELHOR para Vue 3 + Composition API
 * se você está dentro de uma função async, e ainda quiser manter o await, a versão mínima com await seria:
 * Isso garante que, se getInscricao(1) retornar null ou undefined, o spread será feito em um objeto vazio, evitando erro.
 * Sem .finally()
 *
 * arrow function (Function Expression)
 * No seu caso com Vue 3 <script setup>:
 * Como você está trabalhando com Vue 3 + Composition API, o ideal e mais limpo é:
 */
// const btnFormModal = async () => {
//    formDataModal.value = { ...((await getInscricao(1)) || {}) };
//    formModalVisivel.value = true;
// };

/**
 * MELHOR para Vue 3 + Composition API
 * versão const btnFormModal()
 * sem await usando Promise.then
 * Aqui usamos .finally() para garantir que o modal será exibido mesmo se os dados vierem vazios
 *
 * arrow function (Function Expression)
 * No seu caso com Vue 3 <script setup>:
 * Como você está trabalhando com Vue 3 + Composition API, o ideal e mais limpo é:
 */
const btnFormModal = (inscricaoId) =>
   getInscricao(inscricaoId)
      .then((data) => (formDataModal.value = { ...(data || {}) }))
      .finally(() => {
         formModalVisivel.value = true;
      });

/**
 * versão function btnFormModal()
 * sem await usando Promise.then
 * Aqui usamos .finally() para garantir que o modal será exibido mesmo se os dados vierem vazios
 *
 * Função declarada (Function Declaration) Antiga mais usada Vue2 Código tradicional (script options, Vue 2)
 * É elevada (hoisted): pode ser chamada antes mesmo da sua definição no código.
 *
 */
// function btnFormModal(inscricaoId) {
//    getInscricao(inscricaoId)
//       .then((data) => (formDataModal.value = { ...(data || {}) }))
//       .finally(() => {
//          formModalVisivel.value = true;
//       });
// }

function salvarDados(dados) {
   console.log('Dados salvos:', dados);
   formModalVisivel.value = false;
}

function destroyDados(dados) {
   console.log('destroyDados:', dados);
   formModalVisivel.value = false;
}

function atualizarTabela() {
   crudTableRef.value?.refreshTable();
}

const onDelete = (row) => {
   // console.log('Excluir', row);
   showDeleteModal.value = true;
};

const onEdit = (row) => {
   console.log('Editar', row);
   formError.value = {};
   showEditModal.value = true;

   /**
    * Carrega os dados da linha DataTables para o formulário de edição - Uma a um
    */

   // campos Chaves Primária e Estrangeiras
   formData.value.id = row?.id || '';
   formData.value.evento_id = row?.evento_id || '';
   formData.value.pessoa_id = row?.pessoa_id || '';
   formData.value.funcao_id = row?.funcao_id || '';

   // campos não editados nesse formulário
   formData.value.ativo = row?.ativo || 'SIM';

   // campo de dados
   formData.value.nome_completo = row.pessoa?.nome_completo || '';
   formData.value.modalidade = row?.modalidade || '';
   formData.value.chegada_meio_transp = row?.chegada_meio_transp || '';
   formData.value.chegada_cia_transp = row?.chegada_cia_transp || '';
   // TODO Carrega os dados usando row...

   // TODO Carrega os dados do Banco de Dados para o formulário de edição
   // const inscricaoId = row.value?.id;
   // api.get('/inscricao/${inscricaoId}')...
};

// NOVO
const saveEditModal = async () => {
   // console.log('Salvar Edit Modal', formData.value);

   try {
      // if (this.modalModo === 'edit') {
      //    await api.put(`veiculo/${this.form.id}`, this.form); // atualiza o registro
      // } else {
      //    await api.post('veiculo', this.form); // insere um novo registro
      // }

      await api.put(`inscricao/${formData.value.id}`, formData.value); // atualiza o registro

      showToast({
         title: 'Sucesso',
         message: `Inscrição ID ${formData.value.id} atualizada com sucesso.`,
      });
      showEditModal.value = false;
      atualizarTabela();
   } catch (error) {
      if (error.response?.status === 422) {
         // console.log('Erro 422 - Há erros de validação no formError');
         formError.value = error.response.data.errors || {};
      }
   } finally {
      // loading.value = false;
   }
};
</script>
