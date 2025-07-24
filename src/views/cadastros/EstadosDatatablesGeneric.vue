<script setup>
import { ref, toRaw, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import api from '@/services/api';

// import 'datatables.net-dt';
// import DataTable from 'datatables.net-vue3';
import DataTablesLib from 'datatables.net-bs5';

// define a Entidade Principal da View
const entity = 'estado';

const { showToast } = useToast(); // Toasts de Alerta

// recuperas as Autorizações (abilities) do JWT
// const { can } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

// Permissões específicas para a entidade "veiculo"
// const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
// const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
// const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
// const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
// const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro

// var canPrint = can(`${entity}.print`);
// var canPrint = false;

const crudRef = ref(null);

function chamarRefresh() {
   crudRef.value?.refreshTable();
}

// DEBUG de todas abilities do User Logado
// console.log('Abilities carregadas:', abilities.value);

/**
 * BASE Crud - colunas da tabela de dados
 */
const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Nome do Estado', data: 'descricao', class: 'fw-bold' },
   { title: 'Sigla', data: 'sigla' },
   {
      title: 'Região',
      data: 'regiao.descricao',
      render: (data) => `${data} `,
      className: 'text-left',
   },
];

/**
 * BASE Crud - Valores padrão dos campos do formulário
 */
const defaultValues = {
   regiao_id: null,
   sigla: 'Sigla',
   descricao: 'Descrição',
};

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso - recupera as abilities do usuário logado na ação
   const canEditarRegiao = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';

   return `
    <button class="btn btn-xs btn-outline-info" ${canEditarRegiao} data-custom-action="editarRegiao" data-param1="${row.regiao.id}" data-param2="${row.regiao.sigla}" >Editar Região</button>
  `;
   //       <button class="btn btn-xs btn-outline-info" ${canEditarRegiao} data-custom-action="editarCarro" data-param1="${row.regiao.id}" data-param2="${row.regiao.sigla}" >Editar Carro</button>
};

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const showRegiaoModal = ref(false);
const regiaoFormDados = ref({});
const regiaoFormErros = ref({});

/**
 * ESPECIALIZAÇÃO CRUD: recupera da API listas de dados necessários para o CRUD
 * ex.: lista de Regiões do País
 *       lista de Cidades
 *       lista de Categorias
 *       lista de Tipos de Eventos
 */
import { useEventos } from '@/composables/useEventos';
const { fetchRegioes, regioes } = useEventos();
fetchRegioes();

/**
 * BASE Crud - Filtros da tabela de dados
 * Necessário que a API receba o parametro enviado no GET e aplique o filtro where requerido
 */
const filters = [{}]; // nessse caso sem filtros

// const filters = computed(() => [
//    {
//       label: 'Região',
//       field: 'regiao_id',
//       type: 'select',
//       options: regioes.value.map((regiao) => ({
//          value: regiao.id,
//          label: regiao.descricao,
//       })),
//    },
// ]);

/**
 * ESPECIALIZAÇÃO CRUD: captura eventos disparado quando o usuário clica no botão extra da tabela de dados
 */
const onExtraAction = async ({ id, row, action, dataset, target }) => {
   // console.log(
   //    'onExtraAction ID:',
   //    id,
   //    'row:',
   //    row,
   //    'action:',
   //    action,
   //    'dataset:',
   //    dataset,
   //    'target: (por ora não usado)',
   //    target
   // );

   if (action === 'editarRegiao') {
      // console.log('ZAP: ', row, action, dataset, target);
      // vamos chamar uma função editar a action 'editarRegiao'
      // nesse caso estamos usando os dados da linha (row) para preencher o formulário
      regiaoFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      editarRegiao();

      // mas poderiamos também apenas passar o id da região para a função editarRegiao(id) e carregar os dados da API novamente com os dados atualizados
   }

   if (action == 'editarCarro') {
      console.log('editarCarro: ', row, action, dataset, target);
      // criar as refs(), ex: regiaoFormDados.value (ver acima)
      // carregar os dados: usar o mesmos da row DataTables recebidos ou carregar via
      // chamar função editEntidade()
      // depois chamar a função para persistir os dados ex. salvarRegiao() ver abaixo como foi usado
   }
};

const editarRegiao = async () => {
   // Aqui você pode implementar a lógica para editar a região
   // ou já usamos os dados do formulário preenchidos
   // console.log('Editar Região:', regiaoFormDados.value);
   showRegiaoModal.value = true;
   // ou aqui poderia chamar uma API para buscar os dados da região pelo ID
   // showRegiaoModal.value = false; // Fecha o modal após salvar
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarRegiao = async () => {
   // console.log('Salvar Região:', regiaoFormDados.value.regiao);

   try {
      // console.log('Try Salvar Região:', regiaoFormDados.value.regiao);
      // console.log('Try Salvar Região:', toRaw(regiaoFormDados.value.regiao));

      await api.put(
         `regiao/${regiaoFormDados.value.regiao.id}`,
         toRaw(regiaoFormDados.value.regiao)
      );

      showToast({
         title: 'Sucesso',
         message: `Região ID ${regiaoFormDados.value.regiao.id} atualizada com sucesso.`,
      });
      showRegiaoModal.value = false;
      chamarRefresh(); // chama refreshTable() do composable via expose
   } catch (error) {
      if (error.response?.status === 422) {
         regiaoFormErros.value = error.response.data.errors || {};
      }
   }
};
</script>

<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      ref="crudRef"
      title="Cadastro de Estados e Regiões "
      description="Gerenciamento do cadastro de Estados e Regiões da Federação"
      endpoint="estado"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :extra-column-render="extraColumnRender"
      :columnActionsWidth="240"
      :abilities="abilities"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->

         <label class="form-label fw-bold">Nome do Estado da Federação</label>
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

         <label class="form-label fw-bold">Região do País</label>
         <CFormSelect
            v-model="form.value.regiao_id"
            :options="[
               { value: '', label: 'Selecione' },
               ...regioes.map((regiao) => ({
                  value: regiao.id,
                  label: regiao.descricao,
               })),
            ]"
         />
         <div class="form-error" v-if="errors.value.regiao_id">
            {{ errors.value.regiao_id[0] }}
         </div>
      </template>
   </GenericCrud>

   <!-- Extra Modal Especializado -->
   <CModal
      :visible="showRegiaoModal"
      @close="showRegiaoModal = false"
      backdrop="static"
   >
      <!-- <CModalHeader class="bg-primary text-white border-bottom shadow-sm">
         <strong>Editar Região</strong>
      </CModalHeader> -->
      <CModalHeader class="bg-primary fw-bold text-white">Editar Região</CModalHeader>
      <!-- <CModalHeader class="bg-light p-3">Editar Região</CModalHeader> -->
      <CModalBody>
         <label class="form-label fw-bold mb-1 mt-0">Nome da Região</label>
         <!-- <div class="form-text">
            {{ regiaoFormDados.regiao.descricao }}
         </div> -->

         <CFormInput
            v-model="regiaoFormDados.regiao.descricao"
            :class="{ 'is-invalid': regiaoFormErros.descricao }"
         />

         <label class="form-label fw-bold mb-1 mt-0">Sigla</label>
         <CFormInput
            v-model="regiaoFormDados.regiao.sigla"
            :class="{ 'is-invalid': regiaoFormErros.sigla }"
         />
      </CModalBody>
      <CModalFooter>
         <CButton
            color="btn btn-secondary btn-sm me-1"
            @click="showRegiaoModal = false"
            ><i class="fa fa-times"></i> Fechar</CButton
         >
         <CButton color="btn btn-primary btn-sm me-1" @click="salvarRegiao"
            ><i class="fa fa-save"></i> Salvar</CButton
         >
      </CModalFooter>
   </CModal>
</template>
