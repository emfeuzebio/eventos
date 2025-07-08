<script setup>
import { ref, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';

// import { useEventos } from '@/composables/useEventos';
// const { fetchEstados, estados } = useEventos();

// define a Entidade Principal da View
const entity = 'regiao';

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
// const { abilities } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

// Permissões específicas para a entidade "veiculo"
const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro

var canPrint = can(`${entity}.print`);
var canPrint = false;

// DEBUG de todas abilities do User Logado
// console.log('Abilities carregadas:', abilities.value);
// console.log('canList:', canList); // Isso deve ser true ou false
// console.log('canShow:', canShow); // Isso deve ser true ou false
// console.log('canInsert:', canInsert); // Isso deve ser true ou false
// console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
// console.log('canDelete:', canDelete); // Isso deve ser true ou false
// console.log('canPrint:', canPrint); // Isso deve ser true ou false

/**
 * BASE Crud - colunas da tabela de dados
 */
const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Nome da Região', data: 'descricao', class: 'fw-bold' },
   { title: 'Sigla', data: 'sigla' },
];

/**
 * BASE Crud - Valores padrão dos campos do formulário
 */
const defaultValues = {
   sigla: 'Sigla',
   descricao: 'Descrição',
};

/**
 * BASE Crud - Filtros da tabela de dados
 */
const filters = [{}]; // nessse caso sem filtros

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso
   const canEnviarZapp = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';

   return `
    <button class="btn btn-xs btn-outline-info" ${canEnviarZapp} data-custom-action="zap" data-param1-id="${row.param1_id}" data-param2-id="umValor" >Ver</button>
  `;
};

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const showZapModal = ref(false);
const zapFormData = ref({});

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   console.log(
      'onExtraAction ID:',
      id,
      'row:',
      row,
      'action:',
      action,
      'dataset:',
      dataset,
      'target: (por ora não usado)',
      target
   );

   if (action === 'zap') {
      // console.log('ZAP: ', row, action, dataset, target);
      // aqui você pode chamar uma função para marcar a viagem como chegada
      // por exemplo, chamar uma API ou atualizar o estado local
      // await marcarViagemChegada(row.id);
      zapFormData.value = { ...row }; // preenche os dados do formulário com os dados da linha
      showZapModal.value = true;
   }
};
</script>

<template>
   <!-- {{ rotas }} -->
   <!-- {{ eventos }} -->

   <GenericCrud
      title="Cadastro de Regiões"
      description="Gerenciamento do cadastro de Regiões do País"
      endpoint="regiao"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :extra-column-render="extraColumnRender"
      :columnActionsWidth="200"
      :abilities="abilities"
      :canList="canList"
      :canShow="canShow"
      :canInsert="canInsert"
      :canUpdate="canUpdate"
      :canDelete="canDelete"
      :canPrint="canPrint"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <label class="form-label fw-bold">Nome da Região do Páis</label>
         <CFormInput
            v-model="form.value.descricao"
            :class="{ 'is-invalid': errors.descricao }"
         />
         <div class="form-error" v-if="errors.value.descricao">
            {{ errors.value.descricao[0] }}
         </div>

         <label class="form-label fw-bold">Sigla</label>
         <CFormInput
            v-model="form.value.sigla"
            :class="{ 'is-invalid': errors.sigla }"
         />
         <div class="form-error" v-if="errors.value.sigla">
            {{ errors.value.sigla[0] }}
         </div>
      </template>
   </GenericCrud>

   <!-- Extra Modal Especializado -->
   <CModal
      :visible="showZapModal"
      @close="showZapModal = false"
      backdrop="static"
   >
      <CModalHeader>
         <strong>Meu Modal Especializado </strong>
      </CModalHeader>
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Nome da Região</label>
         <div class="form-text">
            {{ zapFormData.descricao }}
         </div>

         <label class="form-label fw-bold mb-1 mt-0">Sigla</label>
         <div class="form-text">
            {{ zapFormData.descricao }}
         </div>
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="showZapModal = false"
            >Fechar</CButton
         >
         <!-- <CButton color="btn btn-primary btn-sm me-1">Salvar</CButton> -->
      </CModalFooter>
   </CModal>
</template>
