<template>
   <!-- DataTables principal do CRUD -->
   <GenericCrud
      title="Lista de Eventos"
      description="Gerenciamento de Eventos e seus Serviços por dia"
      endpoint="evento"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :extra-column-render="extraColumnRender"
      :columnActionsWidth="140"
      :abilities="abilities"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <!-- {{ rotas }} -->
         <!-- {{ form.value }} -->

         <label class="form-label fw-bold">Evento</label>
         <CFormSelect
            v-model="form.value.evento_id"
            :disabled="form.value.ativo === 'NÃO'"
            :options="[
               // ...((glbventosAtivos || []).filter(ev => hotelTemQuartos ? ev.id === 1 : true
               // ...((glbventosAtivos || []).filter(ev => form.value.ativo === 'NÃO' ? ev.id === form.value.evento_id : true
               ...(todosEventos || [])
                  .filter(
                     (ev) =>
                        form.value.ativo === 'SIM' ? ev.ativo === 'SIM' : true
                     // ...((todosEventos    || []).filter(ev => true
                  )
                  .map((ev) => ({
                     value: ev.id,
                     label: ev.nome,
                  })),
            ]"
         />
         <div class="form-error" v-if="errors.value.evento_id">
            {{ errors.value.evento_id[0] }}
         </div>

         <label class="form-label fw-bold">Nome do Hotel</label>
         <CFormInput
            v-model="form.value.nome"
            :disabled="form.value.ativo === 'NÃO'"
            :class="{ 'is-invalid': errors.nome }"
         />
         <div class="form-error" v-if="errors.value.nome">
            {{ errors.value.nome[0] }}
         </div>

         <label class="form-label fw-bold">Sigla</label>
         <CFormInput
            v-model="form.value.sigla"
            :disabled="form.value.ativo === 'NÃO'"
            :class="{ 'is-invalid': errors.sigla }"
         />
         <div class="form-error" v-if="errors.value.sigla">
            {{ errors.value.sigla[0] }}
         </div>

         <label class="form-label fw-bold">Ativo</label>
         <CFormSelect
            v-model="form.value.ativo"
            :options="[
               { value: 'SIM', label: 'SIM' },
               { value: 'NÃO', label: 'NÃO' },
            ]"
         />
         <div class="form-error" v-if="errors.value.ativo">
            {{ errors.value.ativo[0] }}
         </div>
      </template>
   </GenericCrud>

   <!-- Modal Table Editar Quartos - Extra Modal Especializado -->
   <CModal
      :visible="quatosFormModal"
      @close="quatosFormModal = false"
      backdrop="static"
      size="lg"
   >
      <CModalHeader class="bg-primary text-white fw-bold">
         Evento : {{ quatosFormDados.nome }}
      </CModalHeader>
      <CModalBody>
         <CButton
            v-if="quatosFormDados.ativo === 'SIM'"
            color="btn btn-sm btn-outline-success mb-2 me-2"
            @click="novoQuartoDoHotel()"
            >Novo Serviço</CButton
         >
         <CButton
            color="btn btn-sm btn-outline-secondary mb-2"
            @click="reloadTable()"
            ><i class="fa fa-refresh"></i
         ></CButton>

         <!-- DataTable embutido no Modal -->
         <DataTable
            :columns="dtColumns"
            :options="dtConfig"
            class="display table table-striped table-bordered table-hover table-sm compact w-100"
         />
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="quatosFormModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
      </CModalFooter>
   </CModal>

   <!-- Editar o Quarto Modal -->
   <CModal
      :visible="editarQuartoModal"
      @close="fecharEditarQuarto"
      size="md"
      backdrop="static"
   >
      <CModalHeader class="bg-primary text-white fw-bold">
         Editar Serviços oferecidos no Evento
      </CModalHeader>

      <CModalBody>
         <!-- Dia do Evento -->
         <div class="mb-3">
            <label class="form-label fw-bold">Dia do Evento</label>

            <!-- usando input para funcionar o foco -->
            <input
               ref="numeroFoco"
               type="date"
               v-model="quartoSelecionado.data_servico"
               class="form-control"
               :class="{ 'is-invalid': !!quatosFormErros.data_servico }"
            />
            <div class="form-error" v-if="quatosFormErros.data_servico">
               {{ quatosFormErros.data_servico[0] }}
            </div>
            <div class="form-text">Informar a Data do Dia do Evento</div>
         </div>

         <!-- Hospedagem -->
         <div class="mb-3">
            <label class="form-label fw-bold"
               >Oferece Hospedagem?
               {{ quartoSelecionado.oferece_hospedagem }}</label
            >
            <div class="form-check form-switch">
               <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="quartoSelecionado.oferece_hospedagem === 'SIM'"
                  @change="
                     quartoSelecionado.oferece_hospedagem = $event.target
                        .checked
                        ? 'SIM'
                        : 'NÃO'
                  "
               />
            </div>
            <div class="form-error" v-if="quatosFormErros.oferece_hospedagem">
               {{ quatosFormErros.oferece_hospedagem[0] }}
            </div>
            <div class="form-text">
               Marque se será oferecido o serviço de Hospedagem neste dia
            </div>
         </div>

         <!-- Translado -->
         <div class="mb-3">
            <label class="form-label fw-bold"
               >Oferece Traslado?
               {{ quartoSelecionado.oferece_traslado }}</label
            >
            <div class="form-check form-switch">
               <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="quartoSelecionado.oferece_traslado === 'SIM'"
                  @change="
                     quartoSelecionado.oferece_traslado = $event.target.checked
                        ? 'SIM'
                        : 'NÃO'
                  "
               />
            </div>
            <div class="form-error" v-if="quatosFormErros.oferece_traslado">
               {{ quatosFormErros.oferece_traslado[0] }}
            </div>
            <div class="form-text">
               Marque se será oferecido o serviço de Traslado neste dia
            </div>
         </div>

         <!-- Café da Manhã -->
         <div class="mb-3">
            <label class="form-label fw-bold"
               >Oferece Café da Manhã?
               {{ quartoSelecionado.oferece_cafe }}</label
            >
            <div class="form-check form-switch">
               <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="quartoSelecionado.oferece_cafe === 'SIM'"
                  @change="
                     quartoSelecionado.oferece_cafe = $event.target.checked
                        ? 'SIM'
                        : 'NÃO'
                  "
               />
            </div>
            <div class="form-error" v-if="quatosFormErros.oferece_cafe">
               {{ quatosFormErros.oferece_cafe[0] }}
            </div>
            <div class="form-text">
               Marque se será oferecido o serviço de Café da Manhã neste dia
            </div>
         </div>

         <!-- Café da Almoço -->
         <div class="mb-3">
            <label class="form-label fw-bold"
               >Oferece Almoço? {{ quartoSelecionado.oferece_almoco }}</label
            >
            <div class="form-check form-switch">
               <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="quartoSelecionado.oferece_almoco === 'SIM'"
                  @change="
                     quartoSelecionado.oferece_almoco = $event.target.checked
                        ? 'SIM'
                        : 'NÃO'
                  "
               />
            </div>
            <div class="form-error" v-if="quatosFormErros.oferece_almoco">
               {{ quatosFormErros.oferece_almoco[0] }}
            </div>
            <div class="form-text">
               Marque se será oferecido o serviço de Almoço neste dia
            </div>
         </div>

         <!-- Café da Jantar -->
         <div class="mb-3">
            <label class="form-label fw-bold"
               >Oferece Jantar? {{ quartoSelecionado.oferece_jantar }}</label
            >
            <div class="form-check form-switch">
               <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="quartoSelecionado.oferece_jantar === 'SIM'"
                  @change="
                     quartoSelecionado.oferece_jantar = $event.target.checked
                        ? 'SIM'
                        : 'NÃO'
                  "
               />
            </div>
            <div class="form-error" v-if="quatosFormErros.oferece_jantar">
               {{ quatosFormErros.oferece_jantar[0] }}
            </div>
            <div class="form-text">
               Marque se será oferecido o serviço de Jantar neste dia
            </div>
         </div>
      </CModalBody>

      <CModalFooter>
         <CButton color="secondary" size="sm" @click="fecharEditarQuarto"
            >Cancelar</CButton
         >
         <CButton color="primary" size="sm" @click="salvarQuartoDoHotel"
            >Salvar</CButton
         >
      </CModalFooter>
   </CModal>

   <!-- Confirma Excluir Modal  -->
   <CModal
      :visible="deleteModalVisible"
      @close="deleteModalVisible = false"
      backdrop="static"
   >
      <CModalHeader>
         <strong>Confirmar Exclusão</strong>
      </CModalHeader>
      <CModalBody>
         Tem certeza que deseja excluir os Serviços do Dia:
         <b>{{ quartoSelecionado?.data_servico || '' }}</b> ?
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="fecharConfirmDelete"
            ><i class="fa fa-times"></i> Cancelar</CButton
         >
         <CButton color="btn btn-danger btn-sm me-1" @click="confirmDelete"
            ><i class="fa fa-trash"></i> Excluir</CButton
         >
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { computed, ref, toRaw, watch, nextTick } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { formatToBrDate } from '@/utils/dateFormat';
import { formatToBrDateWeek } from '@/utils/dateFormat';
import DataTable from 'datatables.net-vue3';
import DataTablesLib from 'datatables.net-bs5';
import { useGlobalError } from '@/composables/useGlobalError';
import { useToast } from '@/composables/useToast';
import api from '@/services/api';

DataTable.use(DataTablesLib);

const endpoint = 'servico';

import { useEventos } from '@/composables/useEventos';

const { showToast } = useToast(); // Toasts de Alerta
const {
   todosEventos,
   fetchtodosEventos,
   servicosDoEvento,
   fetchServicosDoEvento,
} = useEventos();
const { showError } = useGlobalError(); // Modal de Erros

// Vamos obter a lista de Eventos Ativo e o Corrente do store
import { useCurrentEventStore } from '@/stores/currentEvent';
const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);
const glbventosAtivos = computed(() => eventosStore.ativos);
// console.log('Eventos Ativos:', glbventosAtivos);

// carrega listas de estidades da API para popular listas: <selects> os filtros
fetchtodosEventos();

const currentEventId = computed(() => currentEvent.value?.id ?? '');
// console.log('currentEventId:', currentEventId);

// define a Entidade Principal da View
const entity = 'hotel';

// recuperas as Autorizações (abilities) do JWT
const { abilities } = useAbilities();
// console.log('Abilities carregadas:', abilities.value);

// define as coluna do DataTables
const columns = [
   { title: 'ID', data: 'id', width: '30px' },
   { title: 'Sigla', data: 'sigla', width: '140px', class: 'fw-bold' },
   { title: 'Nome do Evento', data: 'nome', width: 'auto' },
   { title: 'Periodo', data: 'periodo', width: 'auto' },

   {
      title: 'Dt Início',
      data: null,
      render: function (data, type, row) {
         const dt_inicio = row.inscricao_data_ini?.trim()
            ? formatToBrDate(row.inscricao_data_ini)
            : 'Não informado';
         return `<span class="">${dt_inicio}</span>`;
      },
      className: 'text-center',
      width: '100px',
   },
   {
      title: 'Dt Fim',
      data: null,
      render: function (data, type, row) {
         const dt_fim = row.inscricao_data_fim?.trim()
            ? formatToBrDate(row.inscricao_data_fim)
            : 'Não informado';
         return `<span class="">${dt_fim}</span>`;
      },
      className: 'text-center',
      width: '100px',
   },
   {
      title: 'Ativo',
      data: 'ativo',
      class: 'dt-center small',
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
];

// define os valores padrão dos campos do formulário de edição
const defaultValues = {
   organizacao_id: 1,
   nome: '',
   sigla: '',
   descricao: '',
   local: 'FEB',
   periodo: 'De 10 a 12 de Outubro de 20xx',
   tema: 'Você e a paz ...',
   inscricao_data_ini: '',
   inscricao_data_fim: '',
   ativo: 'SIM',
};

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const canAdmServicosDoEvento = abilities.value.includes('servico.update');

const extraColumnRender = (row) => {
   // console.log('Abilities:', canAdmServicosDoEvento);

   return `
      <button ${
         canAdmServicosDoEvento ? '' : 'disabled'
      } class="btn btn-xs btn-outline-info" data-custom-action="editarQuartosDoHotel" data-evento_id="${
      row.evento_id
   }" data-hotel_id="${row.id}" >Adm Serviços</button>
   `;
};

// carrega listas de entidades da API para popular listas: <selects> os filtros
// Agora a Lista de Eventos Ativos sõa carregado única vez após o login e ficam na Store
import { useEventosStore } from '@/stores/useEventosStore';
const eventosStore = useEventosStore();

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */

// Refs
const quatosFormModal = ref(false);
const quatosFormErros = ref({});
const quatosFormDados = ref({});
const quatosFormOperacao = ref('editar'); // 'novo' ou 'editar'
const deleteModalVisible = ref(false); // controle do modal de exclusão

const editarQuartoModal = ref(false);
const quartoSelecionado = ref({});

// Foco no campo número quando o modal é aberto
const numeroFoco = ref(null);

const focoNoNumero = async () => {
   await nextTick();
   numeroFoco.value?.focus();
};

const eventStore = useCurrentEventStore();
const globalEventoId = computed(() => eventStore.currentEvent?.id || '');
// console.log('Evento ID:', globalEventoId.value);

// filtros externos (você pode mudar conforme o seu contexto)
const externalFilters = ref({
   hotel_id: '1', // exemplo
   ativo: 'SIM', // exemplo
});

let dtInstance = null; // armazenar instância da tabela para usar o reload

// Colunas o DataTable Especializado dentro do Modal
const dtColumns = [
   { title: 'ID', data: 'id', width: '30px' },
   {
      title: 'Dia Evento',
      class: 'text-center fw-bold',
      className: 'text-center', // título coluna
      data: null,
      width: '120px',
      render: function (data, type, row) {
         const data_servico = row.data_servico?.trim()
            ? // ? formatToBrDate(row.data_servico)
              formatToBrDateWeek(row.data_servico)
            : 'Não informado';
         return `<span class="">${data_servico}</span>`;
      },
   },
   {
      title: 'Hospd',
      data: 'oferece_hospedagem',
      className: 'text-center', // título coluna
      class: 'dt-center small',
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.oferece_hospedagem === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.oferece_hospedagem === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   {
      title: 'Traslado',
      data: 'oferece_traslado',
      class: 'dt-center small',
      className: 'text-center', // título coluna
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.oferece_traslado === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.oferece_traslado === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   {
      title: 'Café',
      data: 'oferece_cafe',
      class: 'dt-center small',
      className: 'text-center', // título coluna
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.oferece_cafe === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.oferece_cafe === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   {
      title: 'Almoço',
      data: 'oferece_almoco',
      class: 'dt-center small',
      className: 'text-center', // título coluna
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.oferece_almoco === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.oferece_almoco === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   {
      title: 'Jantar',
      data: 'oferece_jantar',
      class: 'dt-center small',
      className: 'text-center', // título coluna
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.oferece_jantar === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.oferece_jantar === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
   {
      title: 'Ação',
      data: null,
      className: 'text-center', // título coluna
      class: 'text-center', // dado da coluna
      width: '140px',
      render: (data, type, row) =>
         `<button ${
            canAdmServicosDoEvento ? '' : 'disabled'
         } class="btn btn-xs btn-outline-primary btn-edit" data-hotel_id="${
            row.hotel_id
         }"><i class="fa fa-edit"></i> Editar</button>
          <button ${
             canAdmServicosDoEvento ? '' : 'disabled'
          } class="btn btn-xs btn-outline-danger btn-delete" data-hotel_id="${
            row.hotel_id
         }"><i class="fa fa-trash"></i> Excluir</button>
         `,
   },
];

// Configuração do DataTables Especializado dentro do Modal
const dtConfig = {
   responsive: true,
   serverSide: false, // Se usar paginação do Laravel, mude para true
   processing: false, // para ativer o "Carregando..." do DataTables
   order: [],
   rowId: 'id',
   dataSrc: '', // se a resposta for um array simples, use ''
   lengthMenu: [
      [5, 10, 25, 50, 100, -1],
      [5, 10, 25, 50, 100, 'Todos'],
   ],
   pageLength: 5,
   ajax: function (_data, callback, _settings) {
      const filters = {
         ...externalFilters.value,
      };

      api.get(endpoint, { params: filters })
         .then((response) => {
            callback({ data: response.data.data || response.data });
         })
         .catch((error) => {
            callback({ data: [] }); // evitar quebra da tabela
         });
   },
   initComplete: function () {
      dtInstance = this.api(); // salva instância para uso em reload()

      // Delegar evento click para os botões .btn-edit
      this.api()
         .table()
         .container()
         .addEventListener('click', (e) => {
            const tr = e.target.closest('tr'); // Descobre a linha onde clicou
            const rowData = dtInstance.row(tr).data(); // pega os dados dessa linha
            const rowId = tr?.id; // pega o ID da linha (se definido)

            // Pega os atributos data-* do botão clicado
            const eventoId = e.target.getAttribute('data-evento_id');
            const hotelId = e.target.getAttribute('data-hotel_id');
            const numero = e.target.getAttribute('data-numero');

            if (e.target && e.target.classList.contains('btn-edit')) {
               // console.log('Editar Linha:', {
               //    rowId,
               //    eventoId,
               //    hotelId,
               //    numero,
               //    rowData,
               // });

               // envia objeto para a função editar
               // editar({ rowId: rowId, eventoId: eventoId, hotelId: hotelId })
               editarQuartoDoHotel(rowData);
               // envia dados + objeto rowData para a função editar
               // editar(rowId, eventoId, hotelId, rowData)
               // envia apenas o objeto rowData a função editar
               // editar(rowData)
            }

            if (e.target && e.target.classList.contains('btn-delete')) {
               excluirQuartoDoHotel(rowData);
            }

            if (e.target && e.target.classList.contains('btn-show')) {
               ver(rowId, rowData);
            }
         });
   },
   language: {
      url: '/assets/DataTables.pt_BR.json', // continua usando tradução geral
   },
};

// Novo Quarto do Hotel - abre o modal para criar um novo quarto
const novoQuartoDoHotel = async () => {
   if (!currentEvent.value) {
      showError(
         'NECESSÁRIO que o <b>Evento de Trabalho</b> esteja selecionado.'
      );
      return;
   }

   // inicializa o objeto com dados padrão
   quartoSelecionado.value = {
      data_servico: null,
      oferece_transporte: 'NÃO',
      oferece_hospedagem: 'NÃO',
      oferece_lavanderia: 'NÃO',
      oferece_traslado: 'NÃO',
      oferece_cafe: 'NÃO',
      oferece_almoco: 'NÃO',
      oferece_jantar: 'NÃO',
   };

   quatosFormErros.value = {}; // limpa erros antigos
   editarQuartoModal.value = true; // Abre o modal de edição
   quatosFormOperacao.value = 'novo'; // define a operação como 'novo'
   await focoNoNumero();
};

// Editar Quarto do Hotel - abre o modal para editar um quarto
const editarQuartoDoHotel = async (quarto) => {
   if (!currentEvent.value) {
      showError(
         'NECESSÁRIO que o <b>Evento de Trabalho</b> esteja selecionado.'
      );
      return;
   }

   // fetchQuartoTipos();
   quartoSelecionado.value = { ...quarto };
   quatosFormErros.value = {}; // limpa erros antigos
   // console.log('Editar quarto:', quarto);
   editarQuartoModal.value = true;
   quatosFormOperacao.value = 'editar'; // define a operação como 'editar'
   await focoNoNumero();
};

// Fechar o Quarto do Hotel modal
const excluirQuartoDoHotel = async (quarto) => {
   // console.log('excluirQuartoDoHotel:', quarto);
   quartoSelecionado.value = { ...quarto };

   // console.log('excluirQuartoDoHotel:', quartoSelecionado.value);
   deleteModalVisible.value = true; // Abre o modal de confirmação de exclusão
};

const confirmDelete = async () => {
   try {
      await api.delete(`${endpoint}/${quartoSelecionado.value.id}`);

      showToast({
         title: 'Sucesso',
         message: `Serviço ID ${quartoSelecionado.value.id} excluído com sucesso.`,
      });

      deleteModalVisible.value = false;
      quartoSelecionado.value = null;
      reloadTable();
   } catch (error) {
      // if (error.response?.status === 400) {
      //    console.log(error.response.data.message);
      // }
   }
};

const fecharConfirmDelete = () => {
   deleteModalVisible.value = false;
};

// Fechar o Quarto do Hotel modal
const fecharEditarQuarto = () => {
   editarQuartoModal.value = false;
   quartoSelecionado.value = null;
};

// Salvar/Inserir Quarto do Hotel
const salvarQuartoDoHotel = async () => {
   // console.log('salvarQuartoDoHotel:', toRaw(quartoSelecionado.value));
   // console.log('salvarQuartoDoHotel:', quartoSelecionado.value.id);

   const {
      evento_id,
      id,
      data_servico,
      oferece_transporte,
      oferece_hospedagem,
      oferece_lavanderia,
      oferece_traslado,
      oferece_cafe,
      oferece_almoco,
      oferece_jantar,
   } = toRaw(quartoSelecionado.value);

   const payload = {
      evento_id: externalFilters.value.evento_id, // usa o hotel_id do filtro externo,
      id,
      data_servico,
      oferece_transporte,
      oferece_hospedagem,
      oferece_lavanderia,
      oferece_traslado,
      oferece_cafe,
      oferece_almoco,
      oferece_jantar,
   };

   try {
      var mensagem = '';

      if (quatosFormOperacao.value === 'novo') {
         await api.post(`servico`, payload);
         mensagem = `Serviço inserido com sucesso.`;
      } else {
         await api.put(`servico/${quartoSelecionado.value.id}`, payload);
         mensagem = `Serviço ID ${quartoSelecionado.value.id} atualizado com sucesso.`;
      }

      showToast({
         title: 'Sucesso',
         message: mensagem,
      });

      editarQuartoModal.value = false;
      reloadTable();
   } catch (error) {
      if (error.response?.status === 422) {
         quatosFormErros.value = error.response.data.errors || {};
      }
   }
};

// Função para recarregar o DataTables
function reloadTable() {
   if (dtInstance) {
      dtInstance.ajax.reload(null, false);
   }
}

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   if (action === 'editarQuartosDoHotel') {
      // console.log('Editar Quartos do Hotel: ', row, action, dataset, target);
      // console.log('ZAP: ', row, action, dataset, target);

      if (row.ativo != 'SIM') {
         // TODO tranformar o showError num componente como o showToast
         showError(
            'Somente um <b>Hotel ATIVO</b> pode ter seus Quartos editados.'
         );
         return;
      }

      externalFilters.value.evento_id = row.id; // define o hotel_id no filtro externo
      quatosFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      quatosFormModal.value = true; // abre o modal de edição
      // quatosFormDados.value.quarto = {};     // inicializa o objeto
   }
};

// filtro da página - usar quando não há filtros
// const filters = [{}]; // nessse caso sem filtros

// Filtros da Página com valores fixos - filtro reativo aos dados carregados
const filters = computed(() => {
   const ativos = eventosStore.ativos || [];
   const defaultEventId = currentEvent.value?.id || '';

   return [
      {
         label: 'Ativo',
         field: 'ativo',
         default: 'SIM',
         type: 'select',
         options: [
            { value: 'SIM', label: 'SIM' },
            { value: 'NÃO', label: 'NÃO' },
         ],
      },
   ];
});
</script>

<style scoped>
.form-switch .form-check-input {
   width: 4em;
   height: 2em;
   position: relative;
}

.form-switch .form-check-input::before {
   content: 'NÃO';
   position: absolute;
   left: 6px;
   top: 2.3px;
   font-size: 0.9rem;
   color: grey;
   margin-left: 22px;
}

.form-switch .form-check-input:checked::before {
   content: 'SIM';
   left: 22px;
   color: white;
   left: 5px;
   top: 2.3px;
   margin-left: 0px;
}
</style>
