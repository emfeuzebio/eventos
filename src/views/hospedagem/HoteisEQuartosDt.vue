<template>
   <!-- DataTables principal do CRUD -->
   <GenericCrud
      title="Lista de Hotéis "
      description="Gerenciamento de Hotéis"
      endpoint="hotel"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :extra-column-render="extraColumnRender"
      :columnActionsWidth="240"
      :abilities="abilities"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <!-- {{ rotas }} -->
         <!-- {{ form.value }} -->

         <label class="form-label fw-bold">Evento</label>
         <CFormSelect
            v-model="form.value.evento_id"
            :options="[
               ...(glbventosAtivos || [])
                  .filter((ev) => ev.id === currentEventId)
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
            :class="{ 'is-invalid': errors.nome }"
         />
         <div class="form-error" v-if="errors.value.nome">
            {{ errors.value.nome[0] }}
         </div>

         <label class="form-label fw-bold">Sigla</label>
         <CFormInput
            v-model="form.value.sigla"
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
         Quartos do Hotel {{ quatosFormDados.nome }}
      </CModalHeader>
      <CModalBody>
         <CButton
            color="btn btn-sm btn-outline-success mb-2 me-2"
            @click="novoQuartoDoHotel()"
            >Novo Quarto</CButton
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
         Editar Quarto de Hotel
      </CModalHeader>

      <CModalBody>
         <div class="mb-3">
            <label class="form-label fw-bold">Nosso Número</label>
            <!-- usando input para funcionar o foco -->
            <input
               ref="numeroFoco"
               type="text"
               v-model="quartoSelecionado.numero"
               class="form-control"
               :class="{ 'is-invalid': !!quatosFormErros.numero }"
            />

            <div class="form-error" v-if="quatosFormErros.numero">
               {{ quatosFormErros.numero[0] }}
            </div>
            <div class="form-text">
               Indicar o número do quarto no controle interno do Evento. Ex. 100
            </div>
         </div>

         <div class="mb-3">
            <label class="form-label fw-bold">Número no Hotel</label>
            <CFormInput
               v-model="quartoSelecionado.numero_hotel"
               :class="{ 'is-invalid': !!quatosFormErros.numero_hotel }"
            />
            <div class="form-error" v-if="quatosFormErros.numero_hotel">
               {{ quatosFormErros.numero_hotel[0] }}
            </div>
            <div class="form-text">
               Informar o número do quarto no Hotel. Ex. A-101, 202-C, E405,
               etc.
            </div>
         </div>

         <!-- quartoTipos -->
         <div class="mb-3">
            <label class="form-label fw-bold">Tipo</label>
            <CoreUIMultiselect
               v-model="quartoSelecionado.quarto_tipo_id"
               :class="{ 'is-invalid': !!quatosFormErros.quarto_tipo_id }"
               :options="[
                  { value: '', label: 'Selecione' },
                  ...quartoTipos.map((quartoTipo) => ({
                     value: quartoTipo.id,
                     label: quartoTipo.nome,
                  })),
               ]"
            />
            <div class="form-error" v-if="quatosFormErros.quarto_tipo_id">
               {{ quatosFormErros.quarto_tipo_id[0] }}
            </div>
            <div class="form-text">
               Selecionar o tipo. Ex. Simples, Luxo, Casal, etc.
            </div>
         </div>

         <div class="mb-3">
            <label class="form-label fw-bold">Capacidade</label>
            <CFormInput
               v-model="quartoSelecionado.capacidade"
               :class="{ 'is-invalid': !!quatosFormErros.capacidade }"
            />
            <div class="form-error" v-if="quatosFormErros.capacidade">
               {{ quatosFormErros.capacidade[0] }}
            </div>
            <div class="form-text">
               Informar a capacidade de hóspedes entre 1 e 9 pessoas.
            </div>
         </div>

         <div class="mb-3">
            <label class="form-label fw-bold">Custeado</label>
            <CFormSelect
               v-model="quartoSelecionado.custeado"
               :options="[
                  { value: 'SIM', label: 'SIM' },
                  { value: 'NÃO', label: 'NÃO' },
               ]"
            />
            <div class="form-error" v-if="quatosFormErros.custeado">
               {{ quatosFormErros.custeado[0] }}
            </div>
            <div class="form-text">
               Selecionar SIM se o quarto for custeado pela promotora do Evento.
            </div>
         </div>

         <div class="mb-3">
            <label class="form-label fw-bold">Disponível</label>
            <CFormSelect
               v-model="quartoSelecionado.disponivel"
               :options="[
                  { value: 'SIM', label: 'SIM' },
                  { value: 'NÃO', label: 'NÃO' },
               ]"
            />
            <div class="form-error" v-if="quatosFormErros.disponivel">
               {{ quatosFormErros.disponivel[0] }}
            </div>
            <div class="form-text">
               Selecionar NÃO se o quarto está previsto mas não disponível.
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
         Tem certeza que deseja excluir este Quarto de Hotel:
         <br/>
         Número: <b>{{ quartoSelecionado?.numero || '' }}</b>, Número no Hotel: <b>{{ quartoSelecionado?.numero_hotel || '' }}</b>, Tipo: <b>{{ quartoSelecionado?.quarto_tipo.nome || 'xx' }}</b> ?
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
import DataTable from 'datatables.net-vue3';
import DataTablesLib from 'datatables.net-bs5';
import { useToast } from '@/composables/useToast';
import api from '@/services/api';

DataTable.use(DataTablesLib);

const endpoint = 'quarto';

import { useEventos } from '@/composables/useEventos';

const { showToast } = useToast(); // Toasts de Alerta
const { quartoTipos, fetchQuartoTipos } = useEventos();

// Vamos obter a lista de Eventos Ativo e o Corrente do store
import { useCurrentEventStore } from '@/stores/currentEvent';
const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);
const glbventosAtivos = computed(() => eventosStore.ativos);
// console.log('Eventos Ativos:', glbventosAtivos);

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
   { title: 'Nome', data: 'nome', class: 'fw-bold', width: 'auto' },
   { title: 'Sigla', data: 'sigla', width: '160px' },
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
   evento_id: currentEventId,
   hotel_id: '',
   numero: '',
   numero_hotel: '',
   tipo: '',
   capacidade: '1',
   custeado: 'SIM',
   disponivel: 'SIM',
};

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso - recupera as abilities do usuário logado na ação
   // const canEditarQuartosDoHotel = abilities.includes('inscricao.marcarchegada')
   // ? ''
   // : 'disabled';

   return `
      <button class="btn btn-xs btn-outline-info" data-custom-action="editarQuartosDoHotel" data-evento_id="${row.evento_id}" data-hotel_id="${row.id}" >Adm Quartos</button>
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
const quartoSelecionado = ref(null);

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

const dtColumns = [
   { title: 'ID', data: 'id', width: '30px' },
   {
      title: 'Número',
      data: 'numero',
      class: 'text-center fw-bold',
      className: 'text-center',
      width: '60px',
   },
   {
      title: 'Nº Hotel',
      data: 'numero_hotel',
      class: 'text-center',
      className: 'text-center',
      width: '100px',
   },
   { title: 'Tipo', data: 'quarto_tipo.nome', width: 'auto' },
   {
      title: 'Capcid',
      data: 'capacidade',
      width: '80px',
      class: 'text-center',
   },
   {
      title: 'Custeado	',
      data: 'custeado',
      class: 'text-center',
      width: '100px',
   },
   {
      title: 'Ativo',
      data: null,
      className: 'text-center', // título coluna
      // class: 'text-center small',
      class: 'text-center',
      width: '70px',
      render: function (data, type, row) {
         return `<span class="${
            row.disponivel === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.disponivel}</span>`;
      },
   },
   {
      title: 'Ação',
      data: null,
      className: 'text-center', // título coluna
      class: 'text-center', // dado da coluna
      width: '140px',
      render: (data, type, row) =>
         `<button class="btn btn-xs btn-outline-primary btn-edit" data-hotel_id="${row.hotel_id}"><i class="fa fa-edit"></i> Editar</button>
         <button class="btn btn-xs btn-outline-danger btn-delete" data-hotel_id="${row.hotel_id}"><i class="fa fa-trash"></i> Excluir</button>`,
   },
];

// Configura o DataTables de dentro do Modal
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
         evento_id: globalEventoId.value,
      };

      api.get(endpoint, { params: filters })
         .then((response) => {
            callback({ data: response.data.data || response.data });
         })
         .catch((error) => {
            console.error('Erro ao carregar dados:', error);
            if (error.response?.status === 401) {
               // Enviar para a página de login se não estiver autenticado
               router.push('/pages/login');
            }
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
               // excluir(rowId, rowData);
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
   fetchQuartoTipos();

   // inicializa o objeto com dados padrão
   quartoSelecionado.value = {
      numero: '',
      numero_hotel: '',
      quarto_tipo_id: '2',
      capacidade: '2',
      custeado: 'NÃO',
      disponivel: 'SIM',
   };

   quatosFormErros.value = {}; // limpa erros antigos
   editarQuartoModal.value = true; // Abre o modal de edição
   quatosFormOperacao.value = 'novo'; // define a operação como 'novo'
   await focoNoNumero();
};

// Editar Quarto do Hotel - abre o modal para editar um quarto
const editarQuartoDoHotel = async (quarto) => {
   fetchQuartoTipos();
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

   console.log('excluirQuartoDoHotel:', quartoSelecionado.value);


   // editarQuartoModal.value = false;
   // quartoSelecionado.value = null;
   // alert('excluirQuartoDoHotel.' + quarto.numero);
   // alert('excluirQuartoDoHotel.' + quartoSelecionado.value.numero);
   // alert('excluirQuartoDoHotel.' + rowId + ', ' + rowData.numero);
   // console.log('excluirQuartoDoHotel.', rowId, rowData);
   deleteModalVisible.value = true; // Abre o modal de confirmação de exclusão
};

const confirmDelete = async () => {
   try {
      await api.delete(`${endpoint}/${quartoSelecionado.value.id}`);

      showToast({
         title: 'Sucesso',
         message: `Quarto ID ${quartoSelecionado.value.id} excluído com sucesso.`,
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
      hotel_id,
      id,
      numero,
      numero_hotel,
      quarto_tipo_id,
      capacidade,
      custeado,
      disponivel,
   } = toRaw(quartoSelecionado.value);

   const payload = {
      evento_id,
      hotel_id,
      id,
      numero,
      numero_hotel,
      quarto_tipo_id,
      capacidade,
      custeado,
      disponivel,
   };

   try {
      var mensagem = '';

      if (quatosFormOperacao.value === 'novo') {
         payload.evento_id = globalEventoId.value; // usa o evento_id do filtro externo
         payload.hotel_id = externalFilters.value.hotel_id; // usa o hotel_id do filtro externo

         await api.post(`quarto`, payload);
         mensagem = `Quarto inserido com sucesso.`;
      } else {
         await api.put(`quarto/${quartoSelecionado.value.id}`, payload);
         mensagem = `Quarto ID ${quartoSelecionado.value.id} atualizado com sucesso.`;
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

      externalFilters.value.hotel_id = row.id; // define o hotel_id no filtro externo
      quatosFormModal.value = true; // Abre o modal de edição

      // const tipos = await fetchQuartoTipos();
      // console.log('Tipo de Quartos:', toRaw(tipos));

      // Recupera os Quartos do Hotel e popula a variável reativa que lista no EasyTables
      // await fetchQuartosDoHotel(currentEventId.value, row.id);
      // console.log('Quartos do Hotel:', quartosDoHotel.value);
      // console.log('Quartos do Hotel:', toRaw(quartosDoHotel.value));

      // quatosFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      // quatosFormDados.value.quarto = {}; // inicializa o objeto
      // quatosFormDados.value.nome = row.nome; // preenche o nome do hotel
      // quatosFormModal.value = true;    // Abre o modal de edição
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
         // default: 'SIM',
         type: 'select',
         options: [
            { value: 'SIM', label: 'SIM' },
            { value: 'NÃO', label: 'NÃO' },
         ],
      },
   ];
});
</script>
