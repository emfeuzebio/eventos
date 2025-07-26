<script setup>
import { computed, ref, toRaw } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import DataTablesLib from 'datatables.net-bs5';

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
// console.log('Eventos Corrente:', currentEvent.value?.id || 'Não selecionado');

// define a Entidade Principal da View
const entity = 'hotel';

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const { abilities } = useAbilities();

// DEBUG de todas abilities do User Logado
// console.log('Abilities carregadas:', abilities.value);

// define parâmetros das tabela de dados
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

const currentEventId = computed(() => currentEvent.value?.id ?? '');
// console.log('currentEventId:', currentEventId);

// define os valores padrão dos campos do formulário
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

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const quatosFormModal = ref(false);
const quatosFormDados = ref({});
const quatosFormErros = ref({});

// carrega listas de entidades da API para popular listas: <selects> os filtros
// Agora a Lista de Eventos Ativos sõa carregado única vez após o login e ficam na Store
import { useEventosStore } from '@/stores/useEventosStore';
const eventosStore = useEventosStore();

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

      // Abre o modal de edição
      quatosFormModal.value = true;
   }
};

const editarQuartosDoHotel = async () => {
   // Aqui você pode implementar a lógica para editar a região
   // ou já usamos os dados do formulário preenchidos
   // console.log('Editar Região:', regiaoFormDados.value);
   quatosFormModal.value = true;
   // ou aqui poderia chamar uma API para buscar os dados da região pelo ID
   // showRegiaoModal.value = false; // Fecha o modal após salvar
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarQuartoDoHotel = async () => {
   // console.log('salvarQuartoDoHotel:', quatosFormDados.value.quarto);

   try {
      await api.put(
         `regiao/${regiaoFormDados.value.regiao.id}`,
         toRaw(regiaoFormDados.value.regiao)
      );

      showToast({
         title: 'Sucesso',
         message: `Quarto ID ${quatosFormDados.value.quarto.id} atualizado com sucesso.`,
      });
      quatosFormModal.value = false;
      chamarRefresh(); // chama refreshTable() do composable via expose
   } catch (error) {
      if (error.response?.status === 422) {
         quatosFormErros.value = error.response.data.errors || {};
      }
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

const rotaNomeInput = ref(null);
</script>

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
            ref="rotaNomeInput"
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
</template>
