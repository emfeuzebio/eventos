<!-- views/GenericCrudView.vue -->
<template>
   <CButton
      class="btn btn-sm btn-outline-warning me-1 mb-2"
      @click="atualizarTabela"
      >Recarregar da View Especializada
   </CButton>

   <CButton class="btn btn-sm btn-outline-info me-1 mb-2" @click="btnImprimir"
      >Imprimir
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

   <!-- Modal Selecionar viagem -->
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
         <CAlert color="light" v-html="zapViagemEscolhida"></CAlert>
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

   <!-- Modal Confirma Excluir -->
   <CModal
      :visible="showDeleteModal"
      @close="showDeleteModal = false"
      backdrop="static"
      keyboard="true"
   >
      <CModalHeader>
         <strong>Confirmar Exclusão</strong>
      </CModalHeader>
      <CModalBody>
         Tem certeza que deseja excluir este Registro:
         <!-- <br /> -->
         <!-- <b>{{
            form.selectedToDelete.value?.descricao ||
            form.selectedToDelete.value?.nome ||
            'Nome ou Descrição não encontrada.'
         }}</b>
         ? -->
         <!-- <pre>{{ JSON.stringify(form.selectedToDelete.value, null, 2) }}</pre> -->
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="showDeleteModal = false"
            >Cancelar</CButton
         >
         <CButton color="btn btn-danger btn-sm me-1" @click="confirmDelete"
            >Excluir</CButton
         >
      </CModalFooter>
   </CModal>
</template>

<script setup>
import BaseCrudTable from '@/components/BaseCrudTable.vue';
import { formatToBrDateTime } from '@/utils/dateFormat';
import { useToast } from '@/composables/useToast';
import { getAbilities } from '@/services/AuthorizationsService';
import { ref } from 'vue';
import api from '@/services/api';
import { computed } from 'vue';
import axios from 'axios';
import { nextTick } from 'vue';

import {
   CModal,
   CModalHeader,
   CModalBody,
   CModalFooter,
   CButton,
} from '@coreui/vue';
import { useEventos } from '@/composables/useEventos';

const crudTableRef = ref();

const viagensDaRota = ref([]);

const { showToast } = useToast();

const { marcarTrasladoChegada, fetchRotas, rotas } = useEventos();

// recuperas as Autorizações (abilities) do JWT
const abilities = getAbilities();
// console.log('Abilities carregadas:', JSON.parse(JSON.stringify(abilities)));

// filtro da página - usar quando não há filtros
const filters = [{}]; // nessse caso sem filtros

// const filters = [
//    {
//       label: 'Estado',
//       field: 'estado_id',
//       type: 'select',
//       options: estados.value.map((estado) => ({
//          value: estado.id,
//          label: estado.descricao,
//       })),
//    },
// ];

// Filtros da Página com valores fixos - filtro reativo aos dados carregados
// const filters = computed(() => [
//    {
//       label: 'Estado',
//       field: 'estado_id',
//       type: 'select',
//       // options: estados.value.map((estado) => ({
//       //    value: estado.id,
//       //    label: estado.descricao,
//       // })),
//    },
// ]);

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
    <button class="btn btn-xs btn-warning" ${canEnviarZapp} data-custom-action="zap" data-viagem-id="${row.traslado_chegada_viagem_id}">Zap</button>
    <button class="btn btn-xs btn-success" ${canSelecionar} data-custom-action="selecionar">Selecionar</button>

    <div class="form-check form-switch">
      <input class="form-check-input" ${canMarcarcheg} data-custom-action="trasladou" type="checkbox" data-viagem-id="x" data-pessoa-id="${row.pessoa_id}" data-rota-id="x" ${isChecked} >
    </div>
  `;
};

// Delete Modal
const showDeleteModal = ref(false);

// Modal Zap
const showZapModal = ref(false);
const zapMensagem = ref('');
const zapViagemEscolhida = ref('');
const zapRow = ref(null);

const rotaSelecionada = ref(false);
const viagemSelecionada = ref(false);

const onEdit = (row) => {
   console.log('Editar', row);
};

const onDelete = (row) => {
   console.log('Excluir', row);
   showDeleteModal.value = true;
};

const onCustomAction = async ({ row, action, dataset, target }) => {
   console.log('dataset:', dataset);
   console.log('Dados da Linha', row);

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
         chegada_traslado: isChecked,
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

function atualizarTabela() {
   crudTableRef.value?.refreshTable();
}

// const enviarZap = async () => {
//    try {
//       const id = zapRow.value?.id;
//       await axios.post(`/api/inscricao/zap/enviar/${id}`, {
//          mensagem: zapMensagem.value,
//       });
//       showZapModal.value = false;
//       alert('Mensagem enviada com sucesso!');
//    } catch (error) {
//       console.error('Erro ao enviar mensagem:', error);
//       alert('Erro ao enviar WhatsApp');
//    }
// };

// function salvarViagemModal(viagemId)
</script>
