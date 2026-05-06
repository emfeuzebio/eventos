<script setup>
import { ref, toRaw, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import api from '@/services/api';

import DataTablesLib from 'datatables.net-bs5';

// define a Entidade Principal da View
const entity = 'pessoa';
// const entity = 'inscricao';

const { showToast } = useToast(); // Toasts de Alerta

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const abilities = getAbilities(); // recupera do JWR as abilities do usuário logado

// Permissões específicas para a entidade "veiculo"
// const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
// const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
// const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
// const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
// const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro
// var canPrint = can(`${entity}.print`);
// var canPrint = false;

// DEBUG de todas abilities do User Logado
// console.log(`Abilities carregadas da entidade '${entity}'':`, abilities);
// console.log('canList:', canList); // Isso deve ser true ou false
// console.log('canShow:', canShow); // Isso deve ser true ou false
// console.log('canInsert:', canInsert); // Isso deve ser true ou false
// console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
// console.log('canDelete:', canDelete); // Isso deve ser true ou false
// console.log('canPrint:', canPrint); // Isso deve ser true ou false

const crudRef = ref(null);

function chamarRefresh() {
   crudRef.value?.refreshTable();
}

/**
 * BASE Crud - colunas da tabela de dados
 */
const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Entidade', data: 'entidade.sigla', width: '110px' },
   {
      title: 'Nome Completo',
      data: 'nome_completo',
      class: 'fw-bold',
      width: '330px',
   },
   { title: 'E-mail', data: 'email' },
   { title: 'Tel. Celular', data: 'telefone', width: '140px' },
   {
      title: 'Ativa',
      data: 'ativo',
      class: 'dt-center small',
      width: '40px',
      render: function (data, type, row) {
         return `<span class="${
            row.ativo === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.ativo === 'SIM' ? 'SIM' : 'NÃO'}</span>`;
      },
   },
];

/**
 * BASE Crud - Valores padrão dos campos do formulário
 */
const defaultValues = {
   entidade_id: null,
   nome_completo: 'Meu Nome Completo',
   nome_social: 'Meu Nome',
   telefone: '(00) 90000-0000',
   email: 'nome@mail.com',
   ativo: 'SIM',
};

/**
 * ESPECIALIZAÇÃO CRUD: Renderiza uma coluna extra na tabela de dados
 */
const extraColumnRender = (row) => {
   // controle de acesso - recupera as abilities do usuário logado na ação
   const canEditarRegiao = abilities.includes('inscricao.marcarchegada')
      ? ''
      : 'disabled';

   return '';

   //    return `
   //     <button class="btn btn-xs btn-outline-info" ${canEditarRegiao} data-custom-action="editarRegiao" data-param1="${row.regiao.id}" data-param2="${row.regiao.sigla}" >Editar Região</button>
   //   `;
   //       <button class="btn btn-xs btn-outline-info" ${canEditarRegiao} data-custom-action="editarCarro" data-param1="${row.regiao.id}" data-param2="${row.regiao.sigla}" >Editar Carro</button>
};

/**
 * ESPECIALIZAÇÃO CRUD: define a variável reativa
 */
const pessoaShowModal = ref(false);
const pessoaFormDados = ref({});
const pessoaFormErros = ref({});

/**
 * ESPECIALIZAÇÃO CRUD: recupera da API listas de dados necessários para o CRUD
 * ex.: lista de Regiões do País
 *       lista de Cidades
 *       lista de Categorias
 *       lista de Tipos de Eventos
 */
import { useEventos } from '@/composables/useEventos';
const { fetchEntidades, entidades } = useEventos();
fetchEntidades();

/**
 * BASE Crud - botões padrão - aqui você pode desativer botões básicos do CRUD.
 * Default: true para todos
 */
const buttons = { update: true, delete: true, show: false };

/**
 * BASE Crud - Filtros da tabela de dados
 * Necessário que a API receba o parametro enviado no GET e aplique o filtro where requerido
 */
//  const filters = [{}]; // nessse caso sem filtros

const filters = computed(() => [
   {
      label: 'Ativa',
      field: 'ativo',
      type: 'select',
      options: [
         { value: 'SIM', label: 'SIM' },
         { value: 'NÃO', label: 'NÃO' },
      ],
   },
   {
      label: 'Entidade',
      field: 'entidade_id',
      type: 'select',
      options: entidades.value.map((entidade) => ({
         value: entidade.id,
         label: entidade.sigla,
      })),
   },
]);

// const filters = computed(() => [
//    {
//       label: 'Ativo',
//       field: 'ativo',
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
      pessoaFormDados.value = { ...row }; // preenche os dados do formulário com os dados da linha
      editarRegiao();

      // mas poderiamos também apenas passar o id da região para a função editarRegiao(id) e carregar os dados da API novamente com os dados atualizados
   }

   if (action == 'editarCarro') {
      console.log('editarCarro: ', row, action, dataset, target);
      // criar as refs(), ex: pessoaFormDados.value (ver acima)
      // carregar os dados: usar o mesmos da row DataTables recebidos ou carregar via
      // chamar função editEntidade()
      // depois chamar a função para persistir os dados ex. salvarRegiao() ver abaixo como foi usado
   }
};

const editarRegiao = async () => {
   // Aqui você pode implementar a lógica para editar a região
   // ou já usamos os dados do formulário preenchidos
   // console.log('Editar Região:', pessoaFormDados.value);
   pessoaShowModal.value = true;
   // ou aqui poderia chamar uma API para buscar os dados da região pelo ID
   // pessoaShowModal.value = false; // Fecha o modal após salvar
};

/**
 * ESPECIALIZAÇÃO CRUD: função para atualizar a entidade especializada
 */
const salvarRegiao = async () => {
   // console.log('Salvar Região:', pessoaFormDados.value.regiao);

   try {
      // console.log('Try Salvar Região:', pessoaFormDados.value.regiao);
      console.log('Try Salvar Região:', toRaw(pessoaFormDados.value.regiao));

      await api.put(
         `regiao/${pessoaFormDados.value.regiao.id}`,
         toRaw(pessoaFormDados.value.regiao)
      );

      showToast({
         title: 'Sucesso',
         message: `Região ID ${pessoaFormDados.value.regiao.id} atualizada com sucesso.`,
      });
      pessoaShowModal.value = false;
      chamarRefresh(); // chama refreshTable() do composable via expose
   } catch (error) {
      if (error.response?.status === 422) {
         pessoaFormErros.value = error.response.data.errors || {};
      }
   }
};
</script>

<template>
   <!-- {{ rotas }} -->

   <GenericCrud
      ref="crudRef"
      title="Cadastro de Pessoas "
      description=" - Gerenciamento do cadastro de Pessoas inscritas no Evento Atual ou em algum Evento anterior. <br>Usuários <b>Gerentes de Secretaria</b> podem incluir, editar e desativar pessoas."
      endpoint="pessoa"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="buttons"
      :extra-column-render="extraColumnRender"
      :columnActionsWidth="160"
      :abilities="abilities"
      @extraAction="onExtraAction"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->

         <label class="form-label fw-bold">Nome Completo</label>
         <CFormInput
            v-model="form.value.nome_completo"
            :class="{ 'is-invalid': errors.nome_completo }"
         />
         <div class="form-error" v-if="errors.value.nome_completo">
            {{ errors.value.nome_completo[0] }}
         </div>

         <label class="form-label fw-bold">Nome Social (Crachá)</label>
         <CFormInput
            v-model="form.value.nome_social"
            :class="{ 'is-invalid': errors.nome_social }"
         />
         <div class="form-error" v-if="errors.value.nome_social">
            {{ errors.value.nome_social[0] }}
         </div>

         <label class="form-label fw-bold">Sexo</label>
         <CFormSelect
            v-model="form.value.sexo"
            :options="[
               { value: '', label: 'Selecione' },
               { value: 'MASC', label: 'Masculino' },
               { value: 'FEM', label: 'Feminino' },
            ]"
         />
         <div class="form-error" v-if="errors.value.sexo">
            {{ errors.value.sexo[0] }}
         </div>


         <label class="form-label fw-bold">E-Mail</label>
         <CFormInput
            v-model="form.value.email"
            :class="{ 'is-invalid': errors.email }"
         />
         <div class="form-error" v-if="errors.value.email">
            {{ errors.value.email[0] }}
         </div>

         <label class="form-label fw-bold">Telefone</label>
         <CFormInput
            v-model="form.value.telefone"
            :class="{ 'is-invalid': errors.telefone }"
         />
         <div class="form-error" v-if="errors.value.telefone">
            {{ errors.value.telefone[0] }}
         </div>

         <label class="form-label fw-bold">Entidade</label>
         <CoreUIMultiselect
            v-model="form.value.entidade_id"
            :options="[
               { value: '', label: 'Selecione' },
               ...entidades.map((entidade) => ({
                  value: entidade.id,
                  label: entidade.sigla,
               })),
            ]"
         />
         <div class="form-error" v-if="errors.value.entidade_id">
            {{ errors.value.entidade_id[0] }}
         </div>

         <label class="form-label fw-bold">Crachá da FEB?</label>
         <CFormSelect
            v-model="form.value.cracha_feb"
            :options="[
               { value: '', label: 'Selecione' },
               { value: 'SIM', label: 'SIM' },
               { value: 'NÃO', label: 'NÃO' },
            ]"
         />
         <div class="form-error" v-if="errors.value.cracha_feb">
            {{ errors.value.cracha_feb[0] }}
         </div>

         <label class="form-label fw-bold">Ativa?</label>
         <CFormSelect
            v-model="form.value.ativo"
            :options="[
               { value: '', label: 'Selecione' },
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
