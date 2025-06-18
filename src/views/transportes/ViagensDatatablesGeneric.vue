<script setup>
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { formatToBrDateTime } from '@/utils/dateFormat';
import 'datatables.net-dt';

import { useEventos } from '@/composables/useEventos';
const { eventos, loading, error } = useEventos();

// define a Entidade Principal da View
const entity = 'viagem';

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const { abilities } = useAbilities();

// Permissões específicas para a entidade "veiculo"
const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro

var canPrint = can(`${entity}.print`);
var canPrint = true;

// DEBUG de todas abilities do User Logado
console.log('Abilities carregadas:', abilities.value);
console.log('canList:', canList); // Isso deve ser true ou false
console.log('canShow:', canShow); // Isso deve ser true ou false
console.log('canInsert:', canInsert); // Isso deve ser true ou false
console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
console.log('canDelete:', canDelete); // Isso deve ser true ou false
console.log('canPrint:', canPrint); // Isso deve ser true ou false

// define parâmetros das tabela de dados
const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Nome da Rota', data: 'rota.nome' },
   {
      title: 'Data da Viagem',
      data: 'data_hora',
      render: (data) => formatToBrDateTime(`${data}`),
      className: 'text-center',
   },
   {
      title: 'Qts Pessoas',
      data: null,
      render: (data) => `?`,
      className: 'text-center',
   },
   {
      title: 'Veículo',
      data: 'veiculo.descricao',
      render: (data) => `${data} `,
      className: 'text-left',
   },
];

// define os valores padrão dos campos do formulário
const defaultValues = {
   evento_id: '1',
   rota_id: '',
   data_hora: '',
   veiculo_id: '',
   eventos: [],
   rotas: [],
   veiculos: [],
};

const filters = [
   {
      label: 'Rota',
      field: 'rota_id',
      type: 'select',
      options: [
         { value: 1, label: 'Chegada Rodoviária > FEB' },
         { value: 2, label: 'Chegada: Aeroporto JK > FEB' },
         { value: 9, label: 'Chegada Rodoviária > Hotel Plaza' },
      ],
   },
   {
      label: 'Veiculo',
      field: 'veiculo_id',
      type: 'select',
      options: [
         { value: 1, label: 'Veiculo 1' },
         { value: 2, label: 'Veiculo 2' },
      ],
   },
];
</script>

<template>
   <GenericCrud
      title="Lista de Viagens "
      description="Gerenciamento de Viagens"
      endpoint="viagem"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :abilities="abilities"
      :canList="canList"
      :canShow="canShow"
      :canInsert="canInsert"
      :canUpdate="canUpdate"
      :canDelete="canDelete"
      :canPrint="canPrint"
   >
      <!-- Form Dados do Edit/new MOdal -->
      <template #form="{ form, errors }">
         <!-- {{ form.value }} -->
         <!-- <pre> {{ form.value }} </pre> -->

         <div id="formModal" v-if="form.value">
            <label class="form-label fw-bold">Evento</label>
            <CFormSelect
               v-model="form.value.evento_id"
               :options="
                  eventos.map((ev) => ({ value: ev.id, label: ev.nome }))
               "
               :disabled="eventos.length === 0"
            />
            <div class="form-error" v-if="errors.value.evento_id">
               {{ errors.value.evento_id[0] }}
            </div>

            <label class="form-label fw-bold">Rota</label>
            <CFormSelect
               v-model="form.value.rota_id"
               :options="[
                  { value: '', label: 'Selecione' },
                  ...(form.value.rotas || []).map((ev) => ({
                     value: ev.id,
                     label: ev.nome,
                  })),
               ]"
               :disabled="form.value.rotas.length === 0"
            />
            <div class="form-error" v-if="errors.value.rota_id">
               {{ errors.value.rota_id[0] }}
            </div>

            <label class="form-label fw-bold">Data e Hora</label>
            <CFormInput v-model="form.value.data_hora" type="datetime-local" />
            <div class="form-error" v-if="errors.value.data_hora">
               {{ errors.value.data_hora[0] }}
            </div>

            <label class="form-label fw-bold">Veículo</label>
            <CFormSelect
               v-model="form.value.veiculo_id"
               :options="[
                  { value: '', label: 'Selecione' },
                  ...(form.value.veiculos || []).map((ev) => ({
                     value: ev.id,
                     label: ev.descricao,
                  })),
               ]"
               :disabled="form.value.veiculos.length === 0"
            />
            <div class="form-error" v-if="errors.value.veiculo_id">
               {{ errors.value.veiculo_id[0] }}
            </div>
            <!-- {{ form.value }} -->
            <!-- {{ form.value.rotas }} -->
         </div>
      </template>
   </GenericCrud>
</template>
