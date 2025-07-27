<template>
   <!-- {{ rotas }} -->

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

   <!-- Editar Quartos Table - Extra Modal Especializado -->
   <CModal
      :visible="quatosFormModal"
      @close="quatosFormModal = false"
      backdrop="static"
      size="lg"
   >
      <CModalHeader class="bg-primary text-white">
         Editar Quartos do Hotel:
         <span class="fw-bold"> {{ quatosFormDados.nome }}</span>
      </CModalHeader>
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Nome do Quartos</label>

         <EasyDataTable
            :headers="headers"
            :items="quartosDoHotel"
            :loading="loading"
            table-class="table-striped"
            alternating
            :pagination="true"
            :rows-per-page="5"
            :rows-per-page-options="[5, 10, 20, 50]"
         >
            <template #item-acao="quarto">
               <!-- <pre>{{ quarto }}</pre> -->
               <CButton
                  color="btn btn-xs btn-primary"
                  @click="editarQuartoDoHotel(quarto)"
               >
                  Editar
               </CButton>
            </template>
         </EasyDataTable>
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="quatosFormModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <!-- <CButton color="btn btn-primary btn-sm me-1" @click="salvarRegiao"
            ><i class="fa fa-save"></i> Salvar</CButton
         > -->
      </CModalFooter>
   </CModal>

   <!-- Editar o Quarto Modal -->
   <CModal
      :visible="editarQuartoModal"
      @close="fecharEditarQuarto"
      size="md"
      backdrop="static"
   >
      <CModalHeader class="bg-secondary text-white">
         Editar Quartos do Hotel
      </CModalHeader>

      <CModalBody>
         <div class="mb-3">
            <label class="form-label">Número</label>
            <input v-model="quartoSelecionado.numero" class="form-control" />
            <div v-if="quatosFormErros.numero" class="text-danger small">
               {{ quatosFormErros.numero[0] }}
            </div>
         </div>
         <div class="mb-3">
            <label class="form-label">Tipo</label>
            <input v-model="quartoSelecionado.tipo" class="form-control" />
            <div v-if="quatosFormErros.tipo" class="text-danger small">
               {{ quatosFormErros.tipo[0] }}
            </div>
         </div>
         <div class="mb-3">
            <label class="form-label">Custeado</label>
            <select v-model="quartoSelecionado.custeado" class="form-select">
               <option value="SIM">SIM</option>
               <option value="NÃO">NÃO</option>
            </select>
            <div v-if="quatosFormErros.custeado" class="text-danger small">
               {{ quatosFormErros.custeado[0] }}
            </div>
         </div>
         <div class="mb-3">
            <label class="form-label">Disponível</label>
            <select v-model="quartoSelecionado.disponivel" class="form-select">
               <option value="SIM">SIM</option>
               <option value="NÃO">NÃO</option>
            </select>
            <div v-if="quatosFormErros.disponivel" class="text-danger small">
               {{ quatosFormErros.disponivel[0] }}
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
</template>

<script setup>
import { computed, ref, toRaw, watch } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import api from '@/services/api';
import DataTablesLib from 'datatables.net-bs5';

import EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

import { useEventos } from '@/composables/useEventos';
const {
   eventos,
   fetchEventos,
   fetchRotas,
   rotas,
   loading,
   error,
   fetchQuartosDoHotel,
   quartosDoHotel,
} = useEventos();

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

const editarQuartoModal = ref(false);
const quartoSelecionado = ref(null);
const quartos = ref([]);

const headers = [
   { text: 'ID', value: 'id' },
   { text: 'Número', value: 'numero' },
   { text: 'Tipo', value: 'tipo' },
   { text: 'Custeado', value: 'custeado' },
   { text: 'Disponível', value: 'disponivel' },
   { text: 'Ações', value: 'acao' },
];

// Ações
const editarQuartoDoHotel = (quarto) => {
   quartoSelecionado.value = { ...quarto };
   quatosFormErros.value = {}; // limpa erros antigos
   // console.log('Editar quarto:', quarto);
   editarQuartoModal.value = true;
};

const fecharEditarQuarto = () => {
   editarQuartoModal.value = false;
   quartoSelecionado.value = null;
};

const salvarQuartoDoHotel = async () => {
   console.log('salvarQuartoDoHotel:', toRaw(quartoSelecionado.value));
   console.log('salvarQuartoDoHotel:', quartoSelecionado.value.id);

   try {
      await api.put(
         `quarto/${quartoSelecionado.value.id}`,
         toRaw(quartoSelecionado.value)
      );

      showToast({
         title: 'Sucesso',
         message: `Quarto ID ${quartoSelecionado.value.id} atualizado com sucesso.`,
      });
      quatosFormModal.value = false;
      // chamarRefresh(); // chama refreshTable() do composable via expose
   } catch (error) {
      if (error.response?.status === 422) {
         quatosFormErros.value = error.response.data.errors || {};
      }
   }
};

// const { fetchQuartosDoHotel, quartosDoHotel } = useEventos();

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   if (action === 'editarQuartosDoHotel') {
      // alert('Editar Quartos do Hotel: ' + row.id);
      console.log('Editar Quartos do Hotel: ', row, action, dataset, target);
      // console.log('ZAP: ', row, action, dataset, target);

      // quatosFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha

      // Recupera os Quartos do Hotel e popula a variável reativa
      await fetchQuartosDoHotel(currentEventId.value, row.id);
      // console.log('Quartos do Hotel:', quartosDoHotel.value);
      console.log('Quartos do Hotel:', toRaw(quartosDoHotel.value));
      // quatosFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      // quatosFormDados.value.quarto = {}; // inicializa o objeto
      quatosFormDados.value.nome = row.nome; // preenche o nome do hotel

      // Abre o modal de edição
      quatosFormModal.value = true;
      // setTimeout(() => initDataTable(), 200);
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
