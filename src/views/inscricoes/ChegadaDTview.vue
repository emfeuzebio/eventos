<!-- views/GenericCrudView.vue -->
<template>
   <BaseCrudTable
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

   <CModal :visible="showZapModal" @close="showZapModal = false">
      <CModalHeader>
         <strong>Enviar WhatsApp</strong>
      </CModalHeader>
      <CModalBody>
         <div class="mb-3">
            <label class="form-label">Mensagem</label>
            <textarea
               v-model="zapMensagem"
               class="form-control"
               rows="4"
            ></textarea>
         </div>
      </CModalBody>
      <CModalFooter>
         <CButton color="secondary" @click="showZapModal = false"
            >Cancelar</CButton
         >
         <CButton color="primary" @click="enviarZap">Enviar</CButton>
      </CModalFooter>
   </CModal>

   <!-- Confirma Excluir Modal  -->
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
import { computed } from 'vue';
import axios from 'axios';

import { useEventos } from '@/composables/useEventos';
const { marcarTrasladoChegada } = useEventos();

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

import {
   CModal,
   CModalHeader,
   CModalBody,
   CModalFooter,
   CButton,
} from '@coreui/vue';

const { showToast } = useToast();

// const ajaxUrl = 'inscricao';

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
   const isChecked = row.chegada_traslado === 'SIM' ? 'checked' : '';

   return `
    <button class="btn btn-xs btn-warning" data-custom-action="zap">Zap</button>
    <button class="btn btn-xs btn-success" data-custom-action="selecionar">Selecionar</button>

    <div class="form-check form-switch">
      <input class="form-check-input" data-custom-action="trasladou" type="checkbox" data-viagem-id="x" data-pessoa-id="${row.pessoa_id}" data-rota-id="x" ${isChecked} >
    </div>
  `;
};

// Delete Modal
const showDeleteModal = ref(false);

// Modal Zap
const showZapModal = ref(false);
const zapMensagem = ref('');
const zapRow = ref(null);

const onEdit = (row) => {
   console.log('Editar', row);
};

const onDelete = (row) => {
   console.log('Excluir', row);
   showDeleteModal.value = true;
};

const onCustomAction = async ({ row, action, dataset, target }) => {
   console.log('dataset:', dataset);

   if (action === 'zap') {
      zapRow.value = row;
      zapMensagem.value = `Olá ${row.nome}, sua viagem está confirmada.`;
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
            message: 'Dados salvos com sucesso!',
            color: 'success',
         });
      }
   } else if (action === 'selecionar') {
      console.log('Selecionar viagem', row);
   }
};

const enviarZap = async () => {
   try {
      const id = zapRow.value?.id;
      await axios.post(`/api/inscricao/zap/enviar/${id}`, {
         mensagem: zapMensagem.value,
      });
      showZapModal.value = false;
      alert('Mensagem enviada com sucesso!');
   } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar WhatsApp');
   }
};

// function salvarViagemModal(inscricaoId, isChecked) {
//    //  console.log('salvarViagemModal:', inscricaoId, isChecked);

//    const sucesso = salvarViagem(inscricaoId, { chegada_traslado: isChecked });

// }
</script>
