<script setup>
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';

import { useEventos } from '@/composables/useEventos';
const { eventos, loading, error } = useEventos();

// define a Entidade Principal da View
const entity = 'rota';

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
   { title: 'Nome da Rota', data: 'nome' },
   { title: 'Tipo', data: 'tipo' },
   {
      title: 'Origem',
      data: 'origem',
      render: (data) => `${data} `,
      className: 'text-left',
   },
   { title: 'Destino', data: 'destino' },
   {
      title: 'Ativo',
      data: 'ativo',
      render: (data) => (data === 'SIM' ? 'SIM' : 'NÃO'),
      className: 'text-center',
   },
];

// define os valores padrão dos campos do formulário
const defaultValues = {
   evento_id: '1',
   nome: 'De origem para destino',
   tipo: 'Chegada',
   origem: 'Nome do Ponto de origem',
   destino: 'Nome do Ponto de destino',
   ativo: 'SIM',
};

const filters = [{}];
</script>

<template>
   <GenericCrud
      title="Lista de Rotas de Viagens "
      description="Gerenciamento de Rotas de Viagens"
      endpoint="rota"
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
      <template #form="{ form, errors }">
         <CFormSelect
            v-model="form.value.evento_id"
            :options="eventos.map((ev) => ({ value: ev.id, label: ev.nome }))"
            label="Evento"
            :disabled="eventos.length === 0"
         />
         <div class="form-error" v-if="errors.value.evento_id">
            {{ errors.value.evento_id[0] }}
         </div>

         <CFormInput
            v-model="form.value.nome"
            label="Nome da Rota"
            :class="{ 'is-invalid': errors.nome }"
         />
         <div class="form-error" v-if="errors.value.nome">
            {{ errors.value.nome[0] }}
         </div>

         <CFormInput
            v-model="form.value.tipo"
            label="Tipo"
            :class="{ 'is-invalid': errors.tipo }"
         />
         <div class="form-error" v-if="errors.value.tipo">
            {{ errors.value.tipo[0] }}
         </div>

         <CFormInput
            v-model="form.value.origem"
            label="Local de Origem"
            :class="{ 'is-invalid': errors.origem }"
         />
         <div class="form-error" v-if="errors.value.origem">
            {{ errors.value.origem[0] }}
         </div>

         <CFormInput
            v-model="form.value.destino"
            label="Local de Destino"
            :class="{ 'is-invalid': errors.destino }"
         />
         <div class="form-error" v-if="errors.value.destino">
            {{ errors.value.destino[0] }}
         </div>

         <CFormSelect
            v-model="form.value.ativo"
            :options="[
               { value: 'SIM', label: 'SIM' },
               { value: 'NÃO', label: 'NÃO' },
            ]"
            label="Ativo"
         />
         <div class="form-error" v-if="errors.value.ativo">
            {{ errors.value.ativo[0] }}
         </div>
      </template>
   </GenericCrud>
</template>
